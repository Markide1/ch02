import { Module } from "@nestjs/common";
import { AuthorsController } from "./authors.controller";
import { AuthorsService } from "./authors.service";

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
