/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./interface/book.interface";
import { QueryResult } from "pg";

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { title, author, publication_year, isbn } = createBookDto;

    // First check if book with ISBN already exists
    const existingBook = await this.findByIsbn(isbn);
    if (existingBook) {
      throw new ConflictException("Book with this ISBN already exists");
    }

    const insertQuery = `
      INSERT INTO books (title, author, publication_year, isbn)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result: QueryResult<Book> = await this.databaseService.query(
      insertQuery,
      [title, author, publication_year, isbn],
    );
    return result.rows[0];
  }

  // Add this helper method
  private async findByIsbn(isbn: string): Promise<Book | null> {
    const query = `SELECT * FROM books WHERE isbn = $1;`;
    const result: QueryResult<Book> = await this.databaseService.query(query, [
      isbn,
    ]);
    return result.rows[0] || null;
  }

  async findAll(): Promise<Book[]> {
    const selectQuery = `
      SELECT * FROM books 
      ORDER BY created_at DESC;
    `;

    const result: QueryResult<Book> =
      await this.databaseService.query(selectQuery);
    return result.rows;
  }

  async findOne(id: number): Promise<Book> {
    const selectQuery = `
      SELECT * FROM books WHERE id = $1;
    `;

    const result: QueryResult<Book> = await this.databaseService.query(
      selectQuery,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    // First check if book exists
    await this.findOne(id);

    // If ISBN is being updated, check for conflicts
    if (updateBookDto.isbn) {
      const existingBook = await this.findByIsbn(updateBookDto.isbn);
      if (existingBook && existingBook.id !== id) {
        throw new ConflictException("Book with this ISBN already exists");
      }
    }

    const fields: string[] = [];
    const values: (string | number)[] = [];
    let paramCount = 1;

    if (updateBookDto.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(updateBookDto.title);
      paramCount++;
    }

    if (updateBookDto.author !== undefined) {
      fields.push(`author = $${paramCount}`);
      values.push(updateBookDto.author);
      paramCount++;
    }

    if (updateBookDto.publication_year !== undefined) {
      fields.push(`publication_year = $${paramCount}`);
      values.push(updateBookDto.publication_year);
      paramCount++;
    }

    if (updateBookDto.isbn !== undefined) {
      fields.push(`isbn = $${paramCount}`);
      values.push(updateBookDto.isbn);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const updateQuery = `
      UPDATE books 
      SET ${fields.join(", ")} 
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result: QueryResult<Book> = await this.databaseService.query(
      updateQuery,
      values,
    );
    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    // First check if book exists
    await this.findOne(id);

    const deleteQuery = `
      DELETE FROM books WHERE id = $1;
    `;

    await this.databaseService.query(deleteQuery, [id]);
  }

  async countBooksByYear(year: number): Promise<number> {
    const countQuery = `
      SELECT count_books_by_year($1) as count;
    `;

    const result: QueryResult<{ count: string }> =
      await this.databaseService.query(countQuery, [year]);
    return parseInt(result.rows[0].count);
  }

  async searchByTitle(title: string): Promise<Book[]> {
    const searchQuery = `
      SELECT * FROM books 
      WHERE title ILIKE $1
      ORDER BY title;
    `;

    const result: QueryResult<Book> = await this.databaseService.query(
      searchQuery,
      [`%${title}%`],
    );
    return result.rows;
  }
}
