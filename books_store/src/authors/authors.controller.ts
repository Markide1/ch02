import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthorsService } from "./authors.service";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";
import { Author } from "./interfaces/author.interface";

@Controller("authors")
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  /**
   * Get all authors
   * @returns All authors
   */
  @Get()
  findAll(): Author[] {
    return this.authorsService.findAll();
  }

  /**
   * Get one author
   * @returns One author
   */
  @Get(":id")
  findOne(@Param("id") id: string): Author {
    return this.authorsService.findOne(id);
  }

  /**
   * Create author
   * @returns Created author
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAuthorDto: CreateAuthorDto): Author {
    return this.authorsService.create(createAuthorDto);
  }

  /**
   * Update author
   * @returns the updated author
   */
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Author {
    return this.authorsService.update(id, updateAuthorDto);
  }

  /**
   * Delete author
   * @returns Success
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(@Param("id") id: string): void {
    this.authorsService.remove(id);
  }

  /**
   * Get  author by name
   * @returns The named author
   */
  @Get("search/:name")
  findByName(@Param("name") name: string): Author[] {
    return this.authorsService.findByName(name);
  }
}
