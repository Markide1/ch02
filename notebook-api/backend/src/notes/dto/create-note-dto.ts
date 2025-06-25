import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateNoteDto {
  @ApiProperty({
    description: "The title of the note",
    example: "My First Note",
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: "The content of the note",
    example: "This is the content of my first note.",
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
