import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note-dto";
import { UpdateNoteDto } from "./dto/update-note-dto";
import { Note } from "./interfaces/note.interface";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Notes")
@Controller("notes")
@UseGuards(AuthGuard("jwt"))
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: "Create a new note" })
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: { user: { id: string } },
  ): Promise<Note> {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get all notes" })
  async findAll(@Request() req: { user: { id: string } }): Promise<Note[]> {
    return this.notesService.findAll(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single note by ID" })
  @ApiParam({
    name: "id",
    description: "Unique ID of the note",
    type: "string",
  })
  async findOne(
    @Param("id") id: string,
    @Request() req: { user: { id: string } },
  ): Promise<Note> {
    return this.notesService.findOne(id, req.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a note by ID" })
  async update(
    @Param("id") id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: { user: { id: string } },
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteDto, req.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a note by ID" })
  async remove(
    @Param("id") id: string,
    @Request() req: { user: { id: string } },
  ): Promise<{ message: string }> {
    return this.notesService.remove(id, req.user.id);
  }
}
