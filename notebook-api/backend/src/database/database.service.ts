import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Pool, PoolClient } from "pg";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT ?? "5432"),
      database: process.env.DB_NAME || "notebook",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "Post_1234",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Run migrations
    await this.runMigrations();
  }

  private async runMigrations() {
    const client = await this.pool.connect();
    try {
      // Read and execute migration files
      const migrationsPath = path.join(__dirname, "migrations");

      // Create migrations directory if it doesn't exist
      if (!fs.existsSync(migrationsPath)) {
        console.log(`Creating migrations directory: ${migrationsPath}`);
        fs.mkdirSync(migrationsPath, { recursive: true });
      }

      const migrationFiles = fs
        .readdirSync(migrationsPath)
        .filter((file) => file.endsWith(".sql"))
        .sort();

      console.log(`Found migration files: ${migrationFiles.join(", ")}`);

      for (const file of migrationFiles) {
        const migration = fs.readFileSync(
          path.join(migrationsPath, file),
          "utf8",
        );
        await client.query(migration);
        console.log(`Executed migration: ${file}`);
      }
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }
}
