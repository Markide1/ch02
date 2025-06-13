/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CreateNoteDto } from "./dto/create-note-dto";
import { UpdateNoteDto } from "./dto/update-note-dto";
import { Note } from "./interfaces/note.interface";

@Injectable()
export class NotesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const query = `
      INSERT INTO notes (title, content)
      VALUES ($1, $2)
      RETURNING id, title, content, created_at
    `;

    const result: { rows: Note[] } = await this.databaseService.query(query, [
      createNoteDto.title,
      createNoteDto.content,
    ]);

    return result.rows[0];
  }

  async findAll(): Promise<Note[]> {
    const query = `
      SELECT id, title, content, created_at
      FROM notes
      ORDER BY created_at DESC
    `;

    const result: { rows: Note[] } = await this.databaseService.query(query);
    return result.rows;
  }

  async findOne(id: number): Promise<Note> {
    const query = `
      SELECT id, title, content, created_at
      FROM notes
      WHERE id = $1
    `;

    const result: { rows: Note[] } = await this.databaseService.query(query, [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return result.rows[0];
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    // First check if the note exists
    await this.findOne(id);

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
      return this.findOne(id);
    }

    values.push(id);
    const query = `
      UPDATE notes
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, title, content, created_at
    `;

    const result: { rows: Note[] } = await this.databaseService.query(
      query,
      values,
    );
    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    // First check if the note exists
    await this.findOne(id);

    const query = `DELETE FROM notes WHERE id = $1`;
    await this.databaseService.query(query, [id]);
  }
}
