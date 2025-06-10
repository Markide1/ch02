// imports file for service and controller
import { Module } from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { DatabaseService } from "../database/database.service";

@Module({
  controllers: [BooksController],
  providers: [BooksService, DatabaseService],
})
export class BooksModule {}
