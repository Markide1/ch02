// Database Service for managing PostgreSQL connections and operations
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Pool, PoolClient } from "pg";
import { createDatabasePool } from "../config/database.config";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  // Connection pool initialization
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

  // Connection pool cleanup
  async onModuleDestroy() {
    await this.pool.end();
    console.log("Database connection closed...");
  }

  // Method to execute queries
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

  // Method to execute raw SQL commands
  private async initializeDatabase() {
    try {
      await this.createBooksTable();
      await this.createBooksIndex();
      await this.createStoredProcedures();
      console.log("Database setup successful.");
    } catch (error) {
      console.error("Failed to complete setup... :", error);
      throw error;
    }
  }

  // Methods to create tables, indexes, and stored procedures
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

  private async createStoredProcedures() {
    const procedures = [
      `
      CREATE OR REPLACE FUNCTION find_book_by_id(p_id INTEGER)
      RETURNS TABLE (
        id INTEGER,
        title VARCHAR(255),
        author VARCHAR(255),
        publication_year INTEGER,
        isbn VARCHAR(13),
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      ) AS $$
      BEGIN
        RETURN QUERY 
        SELECT b.id, b.title, b.author, b.publication_year, b.isbn, b.created_at, b.updated_at 
        FROM books b 
        WHERE b.id = p_id;
      END;
      $$ LANGUAGE plpgsql;
      `,
      `
      CREATE OR REPLACE FUNCTION find_book_by_isbn(p_isbn VARCHAR(13))
      RETURNS TABLE (
        id INTEGER,
        title VARCHAR(255),
        author VARCHAR(255),
        publication_year INTEGER,
        isbn VARCHAR(13),
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      ) AS $$
      BEGIN
        RETURN QUERY 
        SELECT b.id, b.title, b.author, b.publication_year, b.isbn, b.created_at, b.updated_at 
        FROM books b 
        WHERE b.isbn = p_isbn;
      END;
      $$ LANGUAGE plpgsql;
      `,
      `
      CREATE OR REPLACE FUNCTION find_book_by_title_author(
        p_title VARCHAR(255),
        p_author VARCHAR(255)
      ) RETURNS TABLE (
        id INTEGER,
        title VARCHAR(255),
        author VARCHAR(255),
        publication_year INTEGER,
        isbn VARCHAR(13),
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      ) AS $$
      BEGIN
        RETURN QUERY 
        SELECT b.id, b.title, b.author, b.publication_year, b.isbn, b.created_at, b.updated_at 
        FROM books b 
        WHERE LOWER(b.title) = LOWER(p_title) 
        AND LOWER(b.author) = LOWER(p_author);
      END;
      $$ LANGUAGE plpgsql;
      `,
      `
      CREATE OR REPLACE FUNCTION update_book(
        p_id INTEGER,
        p_title VARCHAR(255),
        p_author VARCHAR(255),
        p_publication_year INTEGER,
        p_isbn VARCHAR(13)
      ) RETURNS books AS $$
      DECLARE
        updated_book books;
      BEGIN
        UPDATE books 
        SET 
          title = COALESCE(p_title, title),
          author = COALESCE(p_author, author),
          publication_year = COALESCE(p_publication_year, publication_year),
          isbn = COALESCE(p_isbn, isbn),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = p_id
        RETURNING * INTO updated_book;
        RETURN updated_book;
      END;
      $$ LANGUAGE plpgsql;
      `,
      `
      CREATE OR REPLACE FUNCTION search_books_by_title(p_title VARCHAR(255))
      RETURNS TABLE (
        id INTEGER,
        title VARCHAR(255),
        author VARCHAR(255),
        publication_year INTEGER,
        isbn VARCHAR(13),
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      ) AS $$
      BEGIN
        RETURN QUERY 
        SELECT b.id, b.title, b.author, b.publication_year, b.isbn, b.created_at, b.updated_at 
        FROM books b 
        WHERE b.title ILIKE '%' || p_title || '%'
        ORDER BY b.title;
      END;
      $$ LANGUAGE plpgsql;
      `,
      `
      CREATE OR REPLACE FUNCTION search_books_by_author(p_author VARCHAR(255))
      RETURNS TABLE (
        id INTEGER,
        title VARCHAR(255),
        author VARCHAR(255),
        publication_year INTEGER,
        isbn VARCHAR(13),
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      ) AS $$
      BEGIN
        RETURN QUERY 
        SELECT b.id, b.title, b.author, b.publication_year, b.isbn, b.created_at, b.updated_at 
        FROM books b 
        WHERE LOWER(b.author) ILIKE LOWER('%' || p_author || '%')
        ORDER BY b.publication_year DESC;
      END;
      $$ LANGUAGE plpgsql;
      `,
      `
      CREATE OR REPLACE FUNCTION get_all_books()
      RETURNS TABLE (
        id INTEGER,
        title VARCHAR(255),
        author VARCHAR(255),
        publication_year INTEGER,
        isbn VARCHAR(13),
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      ) AS $$
      BEGIN
        RETURN QUERY 
        SELECT b.id, b.title, b.author, b.publication_year, b.isbn, b.created_at, b.updated_at 
        FROM books b 
        ORDER BY b.created_at DESC;
      END;
      $$ LANGUAGE plpgsql;
      `,
    ];

    for (const procedure of procedures) {
      await this.query(procedure);
    }
    console.log("All stored procedures created successfully");
  }
}
