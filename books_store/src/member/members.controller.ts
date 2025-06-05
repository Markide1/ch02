import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";
import { MembersService } from "./members.service";
import { CreateMemberDto } from "./dto/create-member-dto";
import { UpdateMemberDto } from "./dto/update-member-dto";
import { Member } from "./interfaces/member.interface";

@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(): Member[] {
    return this.membersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Member {
    return this.membersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMemberDto: CreateMemberDto): Member {
    return this.membersService.create(createMemberDto);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Member {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(@Param("id", ParseIntPipe) id: number): { message: string } {
    const message = this.membersService.remove(id);
    return { message };
  }
}
