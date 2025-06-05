import { Injectable, NotFoundException } from "@nestjs/common";
import { Author } from "./interfaces/author.interface";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";

@Injectable()
export class AuthorsService {
  private readonly authors: Author[] = [
    {
      id: "auth01",
      name: "John Smith",
      birthYear: 1980,
      nationality: "American",
    },
    {
      id: "Us102",
      name: "Sarah Okarane",
      birthYear: 1975,
      nationality: "Uganda",
    },
    {
      id: "Sk204",
      name: "Michael Kimani",
      birthYear: 1990,
      nationality: "Kenya",
    },
  ];

  findAll(): Author[] {
    return this.authors;
  }

  findOne(id: string): Author {
    const author = this.authors.find((a) => a.id === id);
    if (!author) {
      throw new NotFoundException(`Author with ID "${id}" not found.`);
    }
    return author;
  }

  create(createAuthorDto: CreateAuthorDto): Author {
    const newAuthor: Author = {
      id: `aut03`,
      ...createAuthorDto,
    };
    this.authors.push(newAuthor);
    return newAuthor;
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto): Author {
    const index = this.authors.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Author with ID "${id}" not found.`);
    }
    this.authors[index] = { ...this.authors[index], ...updateAuthorDto };
    return this.authors[index];
  }

  remove(id: string): string {
    const index = this.authors.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Author with ID "${id}" not found.`);
    }
    const deletedAuthor = this.authors[index];
    this.authors.splice(index, 1);
    return `Author with ID ${deletedAuthor.id} has been deleted`;
  }
}
