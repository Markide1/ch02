import { Injectable, NotFoundException } from "@nestjs/common";
import { Book } from "./interfaces/book.interface";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@Injectable()
export class BooksService {
  private readonly books: Book[] = [
    {
      id: 1,
      title: "The Great Man",
      authorId: "auth01",
      publishedYear: 2000,
      available: true,
    },
    {
      id: 2,
      title: "To Kill a Mosquito",
      authorId: "Us102",
      publishedYear: 2011,
      available: false,
    },
    {
      id: 3,
      title: "The Sky Is Blue",
      authorId: "Sk204",
      publishedYear: 2020,
      available: true,
    },
  ];

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book {
    const book = this.books.find((b) => b.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found.`);
    }
    return book;
  }

  findbyAuthor(authorId: string): Book[] {
    const books = this.books.filter((b) => b.authorId === authorId);

    if (books.length === 0) {
      throw new NotFoundException(
        `Books with AuthorId "${authorId}" not found.`,
      );
    }

    return books;
  }

  create(createBookDto: CreateBookDto): Book {
    const newBook: Book = {
      id: Math.max(...this.books.map((b) => b.id), 0) + 1,
      ...createBookDto,
      available:
        createBookDto.available !== undefined ? createBookDto.available : true,
    };
    this.books.push(newBook);
    return newBook;
  }

  update(id: number, updateBookDto: UpdateBookDto): Book {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Book with ID "${id}" not found.`);
    }
    this.books[index] = { ...this.books[index], ...updateBookDto };
    return this.books[index];
  }

  remove(id: number): string {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Book with ID "${id}" not found.`);
    }
    const deletedBook = this.books[index];
    this.books.splice(index, 1);
    return `Book with ID ${deletedBook.id} has been deleted`;
  }
}
