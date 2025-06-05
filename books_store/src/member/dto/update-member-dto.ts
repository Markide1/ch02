export class UpdateMemberDto {
  name?: string;
  email?: string;
  membershipType?: "STANDARD" | "PREMIUM";
  active?: boolean;
}
