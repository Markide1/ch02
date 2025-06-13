import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note-dto";
import { UpdateNoteDto } from "./dto/update-note-dto";
import { Note } from "./interfaces/note.interface";

@ApiTags("Notes")
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: "Create a new note" })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({
    status: 201,
    description: "The note has been successfully created.",
    type: Note,
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all notes" })
  @ApiResponse({
    status: 200,
    description: "List of all notes.",
    type: [Note],
  })
  async findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single note by ID" })
  @ApiParam({
    name: "id",
    description: "The ID of the note",
    type: "integer",
  })
  @ApiResponse({
    status: 200,
    description: "The note has been found.",
    type: Note,
  })
  @ApiResponse({ status: 404, description: "Note not found." })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Note> {
    return this.notesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a note by ID" })
  @ApiParam({
    name: "id",
    description: "The ID of the note",
    type: "integer",
  })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({
    status: 200,
    description: "The note has been successfully updated.",
    type: Note,
  })
  @ApiResponse({ status: 404, description: "Note not found." })
  @ApiResponse({ status: 400, description: "Bad Request." })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a note by ID" })
  @ApiParam({
    name: "id",
    description: "The ID of the note",
    type: "integer",
  })
  @ApiResponse({
    status: 204,
    description: "The note has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Note not found." })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.notesService.remove(id);
  }
}
