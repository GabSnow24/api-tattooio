import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { passwordHasher } from '../utils/encrypt.utils';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  response = {
    id: true,
    name: true,
    address: true,
    email: true,
    cellphone: true,
    username: true,
    role: true,
  };
  async create(data: CreateUserDto) {
    try {
      const { username, password, email, taxId } = data;
      const foundUser = await this.prisma.user.findFirst({
        where: {
          taxId,
          username,
          email,
        },
      });

      if (foundUser) {
        Logger.error('User already created', '', 'UserService', true);
        throw new ConflictException('User already created');
      }

      const { hash } = await passwordHasher(password);
      data = { ...data, password: hash };

      const user = await this.prisma.user.create({
        data,
        select: this.response,
      });

      return user;
    } catch (error) {
      Logger.error(error);
      throw new Error(error);
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: this.response,
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: this.response,
    });

    if (!user) {
      Logger.error('User not found', '', 'UserService', true);
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userFinder = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!userFinder) {
      Logger.error('User not found', '', 'UserService', true);
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
      select: this.response,
    });
  }

  async findByUsername(username: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true);
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async remove(id: string) {
    const deleteUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return `This action removes user ${id}`;
  }
}
