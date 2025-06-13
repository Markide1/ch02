import { DatabaseService } from "../database/database.service";
import { CreateNoteDto } from "./dto/create-note-dto";
import { UpdateNoteDto } from "./dto/update-note-dto";
import { Note } from "./interfaces/note.interface";
export declare class NotesService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createNoteDto: CreateNoteDto): Promise<Note>;
    findAll(): Promise<Note[]>;
    findOne(id: number): Promise<Note>;
    update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note>;
    remove(id: number): Promise<void>;
}
