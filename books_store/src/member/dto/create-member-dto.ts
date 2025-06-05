export class CreateMemberDto {
  name: string;
  email: string;
  membershipType: "STANDARD" | "PREMIUM";
}
