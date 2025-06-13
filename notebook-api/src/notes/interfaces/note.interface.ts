import { ApiProperty } from "@nestjs/swagger";

export class Note {
  @ApiProperty({
    description: "The unique identifier of the note",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "The title of the note",
    example: "My First Note",
  })
  title: string;

  @ApiProperty({
    description: "The content of the note",
    example: "This is the content of my first note.",
  })
  content: string;

  @ApiProperty({
    description: "The timestamp when the note was created",
    example: "2024-01-15T10:30:00.000Z",
  })
  created_at: Date;
}
