import { Injectable, NotFoundException } from "@nestjs/common";
import { Member } from "./interfaces/member.interface";
import { CreateMemberDto } from "./dto/create-member-dto";
import { UpdateMemberDto } from "./dto/update-member-dto";

@Injectable()
export class MembersService {
  private readonly members: Member[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joinDate: new Date("2024-01-01"),
      membershipType: "STANDARD",
      active: true,
    },
  ];

  findAll(): Member[] {
    return this.members;
  }

  findOne(id: number): Member {
    const member = this.members.find((m) => m.id === id);
    if (!member) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }
    return member;
  }

  create(createMemberDto: CreateMemberDto): Member {
    const newMember: Member = {
      id: Math.max(...this.members.map((m) => m.id), 0) + 1,
      joinDate: new Date(),
      active: true,
      ...createMemberDto,
    };
    this.members.push(newMember);
    return newMember;
  }

  update(id: number, updateMemberDto: UpdateMemberDto): Member {
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }
    this.members[index] = { ...this.members[index], ...updateMemberDto };
    return this.members[index];
  }

  remove(id: number): string {
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }
    this.members.splice(index, 1);
    return `Member with ID ${id} has been removed`;
  }
}
