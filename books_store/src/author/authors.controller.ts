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

  @Get()
  findAll(): Author[] {
    return this.authorsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Author {
    return this.authorsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAuthorDto: CreateAuthorDto): Author {
    return this.authorsService.create(createAuthorDto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Author {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(@Param("id") id: string): { message: string } {
    const message = this.authorsService.remove(id);
    return { message };
  }
}
