/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// Operations file
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Create a new book
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.booksService.create(createBookDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: "Book created successfully",
      data: book,
    };
  }

  // Retrieve all books or search by title
  @Get()
  async findAll(@Query("title") title?: string) {
    let books;

    if (title) {
      books = await this.booksService.searchByTitle(title);
    } else {
      books = await this.booksService.findAll();
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Books retrieved successfully",
      data: books,
      count: books.length,
    };
  }

  // Count books by year
  @Get("count-by-year/:year")
  async countBooksByYear(@Param("year") year: string) {
    const count = await this.booksService.countBooksByYear(parseInt(year));
    return {
      statusCode: HttpStatus.OK,
      message: `Books count for year ${year}`,
      data: { year: parseInt(year), count },
    };
  }

  // Get a single book by ID
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const book = await this.booksService.findOne(parseInt(id));
    return {
      statusCode: HttpStatus.OK,
      message: "Book retrieved successfully",
      data: book,
    };
  }

  // Update a book by ID
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.booksService.update(parseInt(id), updateBookDto);
    return {
      statusCode: HttpStatus.OK,
      message: "Book updated successfully",
      data: book,
    };
  }

  // Delete a book by ID
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.booksService.remove(parseInt(id));
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: "Book deleted successfully",
    };
  }
}
