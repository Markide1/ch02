import { Module } from "@nestjs/common";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { DatabaseService } from "../database/database.service";

@Module({
  controllers: [NotesController],
  providers: [NotesService, DatabaseService],
})
export class NotesModule {}
