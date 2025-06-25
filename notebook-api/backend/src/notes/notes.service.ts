/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateNoteDto } from "./dto/create-note-dto";
import { UpdateNoteDto } from "./dto/update-note-dto";
import { Note } from "./interfaces/note.interface";

@Injectable()
export class NotesService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Create a new note
  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const checkQuery = `
      SELECT id FROM notes 
      WHERE title = $1 AND content = $2 AND user_id = $3
      LIMIT 1
    `;

    const checkResult = await this.databaseService.query(checkQuery, [
      createNoteDto.title,
      createNoteDto.content,
      userId,
    ]);

    if (checkResult.rows.length > 0) {
      throw new ConflictException(
        "A note with identical title and content already exists",
      );
    }

    const query = `
      INSERT INTO notes (title, content, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, content, created_at, user_id
    `;

    const result = await this.databaseService.query(query, [
      createNoteDto.title,
      createNoteDto.content,
      userId,
    ]);

    return result.rows[0];
  }

  // Retrieve all notes for a user
  async findAll(userId: string): Promise<Note[]> {
    const query = `
      SELECT id, title, content, created_at, user_id
      FROM notes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const query = `
      SELECT id, title, content, created_at, user_id
      FROM notes
      WHERE id = $1 AND user_id = $2
    `;

    const result = await this.databaseService.query(query, [id, userId]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return result.rows[0];
  }

  // Update a note
  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    await this.findOne(id, userId);

    if (updateNoteDto.title && updateNoteDto.content) {
      const checkQuery = `
        SELECT id FROM notes 
        WHERE title = $1 AND content = $2 AND user_id = $3
        AND id != $4
        LIMIT 1
      `;

      const checkResult = await this.databaseService.query(checkQuery, [
        updateNoteDto.title,
        updateNoteDto.content,
        userId,
        id,
      ]);

      if (checkResult.rows.length > 0) {
        throw new ConflictException(
          "A note with identical title and content already exists",
        );
      }
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateNoteDto.title !== undefined) {
      updateFields.push(`title = $${paramIndex}`);
      values.push(updateNoteDto.title);
      paramIndex++;
    }

    if (updateNoteDto.content !== undefined) {
      updateFields.push(`content = $${paramIndex}`);
      values.push(updateNoteDto.content);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return this.findOne(id, userId);
    }

    values.push(id, userId);
    const query = `
      UPDATE notes
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING id, title, content, created_at, user_id
    `;

    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  // Delete a note
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const noteToDelete = await this.findOne(id, userId);
    const query = `DELETE FROM notes WHERE id = $1 AND user_id = $2`;
    await this.databaseService.query(query, [id, userId]);

    return {
      message: `The note: ${noteToDelete.title} has been deleted successfully`,
    };
  }
}
