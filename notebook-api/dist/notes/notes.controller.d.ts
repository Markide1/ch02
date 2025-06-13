import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note-dto";
import { UpdateNoteDto } from "./dto/update-note-dto";
import { Note } from "./interfaces/note.interface";
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    create(createNoteDto: CreateNoteDto): Promise<Note>;
    findAll(): Promise<Note[]>;
    findOne(id: number): Promise<Note>;
    update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note>;
    remove(id: number): Promise<void>;
}
