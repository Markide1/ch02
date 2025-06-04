export class CreateBookDto {
  title: string;
  authorId: string;
  publishedYear: number;
  available?: boolean;
}
