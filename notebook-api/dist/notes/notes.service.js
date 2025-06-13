"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let NotesService = class NotesService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(createNoteDto) {
        const query = `
      INSERT INTO notes (title, content)
      VALUES ($1, $2)
      RETURNING id, title, content, created_at
    `;
        const result = await this.databaseService.query(query, [
            createNoteDto.title,
            createNoteDto.content,
        ]);
        return result.rows[0];
    }
    async findAll() {
        const query = `
      SELECT id, title, content, created_at
      FROM notes
      ORDER BY created_at DESC
    `;
        const result = await this.databaseService.query(query);
        return result.rows;
    }
    async findOne(id) {
        const query = `
      SELECT id, title, content, created_at
      FROM notes
      WHERE id = $1
    `;
        const result = await this.databaseService.query(query, [
            id,
        ]);
        if (result.rows.length === 0) {
            throw new common_1.NotFoundException(`Note with ID ${id} not found`);
        }
        return result.rows[0];
    }
    async update(id, updateNoteDto) {
        await this.findOne(id);
        const updateFields = [];
        const values = [];
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
        const result = await this.databaseService.query(query, values);
        return result.rows[0];
    }
    async remove(id) {
        await this.findOne(id);
        const query = `DELETE FROM notes WHERE id = $1`;
        await this.databaseService.query(query, [id]);
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], NotesService);
//# sourceMappingURL=notes.service.js.map