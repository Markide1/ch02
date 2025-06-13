"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
let DatabaseService = class DatabaseService {
    pool;
    async onModuleInit() {
        this.pool = new pg_1.Pool({
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT ?? "5432"),
            database: process.env.DB_NAME || "notebook",
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "Post_1234",
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
        await this.runMigrations();
    }
    async runMigrations() {
        const client = await this.pool.connect();
        try {
            const migrationsPath = path.join(__dirname, "migrations");
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
                const migration = fs.readFileSync(path.join(migrationsPath, file), "utf8");
                await client.query(migration);
                console.log(`Executed migration: ${file}`);
            }
        }
        finally {
            client.release();
        }
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        }
        finally {
            client.release();
        }
    }
    async getClient() {
        return this.pool.connect();
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=database.service.js.map