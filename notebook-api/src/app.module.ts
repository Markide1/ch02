import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseService } from "./database/database.service";
import { NotesModule } from "./notes/notes.module";

@Module({
  imports: [NotesModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
