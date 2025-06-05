export interface Member {
  id: number;
  name: string;
  email: string;
  joinDate: Date;
  membershipType: "STANDARD" | "PREMIUM";
  active: boolean;
}
