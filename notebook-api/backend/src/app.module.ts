import { Module } from "@nestjs/common";
import { DatabaseService } from "./database/database.service";
import { NotesController } from "./notes/notes.controller";
import { NotesService } from "./notes/notes.service";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [NotesController],
  providers: [DatabaseService, NotesService],
})
export class AppModule {}
