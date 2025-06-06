import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Pool, PoolClient } from "pg";
import { createDatabasePool } from "../config/database.config";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  async onModuleInit() {
    this.pool = createDatabasePool();

    try {
      await this.pool.connect();
      console.log("Database Connected successfully...");
      await this.initializeDatabase();
    } catch (error) {
      console.error("Database connection failed... :", error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log("Database connection closed...");
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      console.error("Database query error... :", error);
      throw error;
    } finally {
      client.release();
    }
  }

  private async initializeDatabase() {
    try {
      await this.createBooksTable();
      await this.createBooksIndex();
      await this.createStoredProcedure();
      console.log("Database setup successful.");
    } catch (error) {
      console.error("Failed to complete setup... :", error);
      throw error;
    }
  }

  private async createBooksTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      publication_year INTEGER NOT NULL,
      isbn VARCHAR(13) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await this.query(createTableQuery);
    console.log("Books table created successfully");
  }

  private async createBooksIndex() {
    const createIndexQuery = `
    CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
  `;
    await this.query(createIndexQuery);
    console.log("Books title index created successfully");
  }

  private async createStoredProcedure() {
    const createStoredProcedureQuery = `
    CREATE OR REPLACE FUNCTION count_books_by_year(year INTEGER)
    RETURNS INTEGER AS $$
    DECLARE
      book_count INTEGER;
    BEGIN
      SELECT COUNT(*) INTO book_count
      FROM books
      WHERE publication_year = year;
      RETURN book_count;
    END;
    $$ LANGUAGE plpgsql;
  `;
    await this.query(createStoredProcedureQuery);
    console.log("Stored procedure count_books_by_year created successfully");
  }
}
