import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateNoteDto {
  @ApiProperty({
    description: "The title of the note",
    example: "Updated Note Title",
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    description: "The content of the note",
    example: "This is the updated content of the note.",
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;
}
