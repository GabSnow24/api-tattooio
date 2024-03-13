import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { passwordHasher } from '../utils/encrypt.utils';
import { ResponseUserObject } from './dto/response-user.object';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
  
  async create(data: CreateUserDto): Promise<ResponseUserObject>{
    try {
      const { username, password, email, taxId } = data
      const foundUser = await this.prisma.user.findFirst({
        where: {
          taxId,
          username,
          email
        }
      })

      if (foundUser) {
        Logger.error('User already created', '', 'UserService', true)
        throw new ConflictException('User already created')
      }

      const { hash } = await passwordHasher(password)
      data = { ...data, password: hash }

      const user = await this.prisma.user.create({
        data,
        select: {
          id: true,
          name: true,
          address: true,
          email: true,
          cellphone: true,
          username: true,
          role: true
        }
      })

      return user
    } catch (error) {
      Logger.error(error)
      throw new Error(error)
    }
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
