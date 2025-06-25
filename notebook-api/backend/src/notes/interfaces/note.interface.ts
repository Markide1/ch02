import { ApiProperty } from "@nestjs/swagger";

export class Note {
  @ApiProperty({
    description: "The unique identifier of the note",
    example: "93a09e27-cf32-41dd-8b0e-cf6541194715",
  })
  id: string;

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

  @ApiProperty({
    description: "The ID of the user who owns this note",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  user_id: string;
}
