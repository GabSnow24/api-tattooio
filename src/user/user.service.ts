import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
  
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async findByUserName(username: string) {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        username
      }
    })
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true)
      throw new NotFoundException('User not found')
    }
    return foundUser
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
