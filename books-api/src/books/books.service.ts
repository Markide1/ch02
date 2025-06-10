/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Business logic file
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

  // Create a new book
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { title, author, publication_year, isbn } = createBookDto;

    // Check for ISBN uniqueness
    const existingBook = await this.findByIsbn(isbn);
    if (existingBook) {
      throw new ConflictException("Book with this ISBN already exists");
    }

    // Check duplicate book
    const duplicateBook = await this.findByTitleAndAuthor(title, author);
    if (duplicateBook) {
      throw new ConflictException(
        "This exact book already exists by this author",
      );
    }

    const result: QueryResult<Book> = await this.databaseService.query(
      "SELECT * FROM create_book($1, $2, $3, $4)",
      [title, author, publication_year, isbn],
    );
    return result.rows[0];
  }

  private async findByIsbn(isbn: string): Promise<Book | null> {
    const result: QueryResult<Book> = await this.databaseService.query(
      "SELECT * FROM find_book_by_isbn($1)",
      [isbn],
    );
    return result.rows[0] || null;
  }

  private async findByTitleAndAuthor(
    title: string,
    author: string,
  ): Promise<Book | null> {
    const result: QueryResult<Book> = await this.databaseService.query(
      "SELECT * FROM find_book_by_title_author($1, $2)",
      [title, author],
    );
    return result.rows[0] || null;
  }

  // Retrieve all books
  async findAll(): Promise<Book[]> {
    const result: QueryResult<Book> = await this.databaseService.query(
      "SELECT * FROM get_all_books()",
    );
    return result.rows;
  }

  // Retrieve a book by ID
  async findOne(id: number): Promise<Book> {
    const result: QueryResult<Book> = await this.databaseService.query(
      "SELECT * FROM find_book_by_id($1)",
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return result.rows[0];
  }

  // Update a book by ID
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    // First check if book exists
    const existingBook = await this.findOne(id);

    // Check if trying to update with same data
    if (updateBookDto.title && updateBookDto.title === existingBook.title) {
      throw new ConflictException("Book already has this title");
    }

    if (updateBookDto.author && updateBookDto.author === existingBook.author) {
      throw new ConflictException("Book already has this author");
    }

    if (
      updateBookDto.publication_year &&
      updateBookDto.publication_year === existingBook.publication_year
    ) {
      throw new ConflictException("Book already has this publication year");
    }

    // Check ISBN uniqueness if being updated
    if (updateBookDto.isbn) {
      if (updateBookDto.isbn === existingBook.isbn) {
        throw new ConflictException("Book already has this ISBN");
      }

      const bookWithIsbn = await this.findByIsbn(updateBookDto.isbn);
      if (bookWithIsbn && bookWithIsbn.id !== id) {
        throw new ConflictException("Book with this ISBN already exists");
      }
    }

    const result: QueryResult<Book> = await this.databaseService.query(
      "SELECT * FROM update_book($1, $2, $3, $4, $5)",
      [
        id,
        updateBookDto.title,
        updateBookDto.author,
        updateBookDto.publication_year,
        updateBookDto.isbn,
      ],
    );
    return result.rows[0];
  }

  // Delete a book by ID
  async remove(id: number): Promise<void> {
    // First check if book exists
    await this.findOne(id);

    await this.databaseService.query("SELECT delete_book($1)", [id]);
  }

  // Count books by publication year
  async countBooksByYear(year: number): Promise<number> {
    const result: QueryResult<{ count: string }> =
      await this.databaseService.query(
        "SELECT count_books_by_year($1) as count",
        [year],
      );

    const count = parseInt(result.rows[0].count);
    if (count === 0) {
      throw new NotFoundException(`No books found for year ${year}`);
    }
    return count;
  }

  // Search books by title
  async searchByTitle(title: string): Promise<Book[]> {
    const result: QueryResult<Book> = await this.databaseService.query(
      "SELECT * FROM search_books_by_title($1)",
      [title],
    );
    return result.rows;
  }

  // Method to find books by author
  async findByAuthor(author: string): Promise<Book[]> {
    const result: QueryResult<Book> = await this.databaseService.query(
      "SELECT * FROM search_books_by_author($1)",
      [author],
    );
    return result.rows;
  }
}
