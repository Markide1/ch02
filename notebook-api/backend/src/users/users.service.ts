/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ConflictException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { User } from "./interfaces/user.interface";

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user exists
    const checkQuery = "SELECT id FROM users WHERE email = $1";
    const checkResult = await this.databaseService.query(checkQuery, [
      createUserDto.email,
    ]);

    if (checkResult.rows.length > 0) {
      throw new ConflictException("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const query = `
            INSERT INTO users (email, password, name)
            VALUES ($1, $2, $3)
            RETURNING id, email, name, created_at
        `;

    const result = await this.databaseService.query(query, [
      createUserDto.email,
      hashedPassword,
      createUserDto.name,
    ]);

    return result.rows[0];
  }

  // Find a user by email
  async findByEmail(email: string): Promise<User & { password: string }> {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await this.databaseService.query(query, [email]);
    return result.rows[0];
  }
}
