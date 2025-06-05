import { Injectable, NotFoundException } from "@nestjs/common";
import { Author } from "./interfaces/author.interface";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { UpdateAuthorDto } from "./dto/update-author.dto";

@Injectable()
export class AuthorsService {
  /**
   * Simple authors array
   * @param {} added authors
   */
  private readonly authors: Author[] = [
    {
      id: "At021",
      name: "A. Brian Kimani",
      biography: "Kenyan novelist, essayist, and short story writer.",
      birthDate: new Date("1976-09-24"),
    },
    {
      id: "Zx132",
      name: "Elly Lee",
      biography:
        "American novelist widely known for her 2000 novel To Kill a Mosquito.",
      birthDate: new Date("1986-04-28"),
    },
    {
      id: "Geo33",
      name: "George Kim",
      biography: "English novelist, essayist, journalist, and critic.",
      birthDate: new Date("1963-06-25"),
    },
  ];

  private nextId: number = 4;

  /**
   * Find all authors
   * @param query Find all authors details
   * @returns Author details
   */
  findAll(): Author[] {
    return this.authors;
  }

  /**
   * Find one author by id
   * @param id Find by author details by id
   * @returns Author details
   */
  findOne(id: string): Author {
    const author = this.authors.find((a) => a.id === id);
    if (!author) {
      throw new NotFoundException(`Author with ID "${id}" not found.`);
    }
    return author;
  }

  /**
   * Find author by name
   * @param query Find by author details by name
   * @returns Author details
   */
  findByName(query: string): Author[] {
    const authors = this.authors.filter((author) =>
      author.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (authors.length === 0) {
      throw new NotFoundException(`No authors found matching "${query}"`);
    }

    return authors;
  }

  /**
   * Create  author id
   * @param id creates new ids
   * @returns  New Author id
   */

  private generateAuthorId(): string {
    const random = Math.random().toString(36).substring(8, 3);
    return `${random}`;
  }

  /**
   * Create author
   * @param id creates new author and id
   * @returns Author has been created
   */
  create(createAuthorDto: CreateAuthorDto): Author {
    const newAuthor: Author = {
      id: this.generateAuthorId(),
      ...createAuthorDto,
      birthDate: new Date(createAuthorDto.birthDate),
    };
    this.authors.push(newAuthor);
    return newAuthor;
  }

  /**
   * Update author
   * @param id updates author's details by id
   * @returns Updated author's details
   */
  update(id: string, updateAuthorDto: UpdateAuthorDto): Author {
    const index = this.authors.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Author with ID "${id}" not found.`);
    }

    const updatedAuthor = {
      ...this.authors[index],
      ...updateAuthorDto,
      birthDate: updateAuthorDto.birthDate
        ? new Date(updateAuthorDto.birthDate)
        : this.authors[index].birthDate,
    };

    this.authors[index] = updatedAuthor;
    return this.authors[index];
  }

  /**
   * Remove author
   * @param id deletes by id
   * @returns Author has been deleted
   */
  remove(id: string): string {
    const index = this.authors.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Author with ID "${id}" not found.`);
    }
    const removedAuthor = this.authors[index];
    this.authors.splice(index, 1);
    return `Author with ID ${removedAuthor.id} has been deleted`;
  }
}
