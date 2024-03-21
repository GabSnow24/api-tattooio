import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  createDtoMock,
  fakeUsers,
  prismaMock,
  prismaSelectQuery,
  selectedResponseMock,
} from './user.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { error } from 'console';

describe('UserService', () => {
  const id = uuidv4();
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it(`should create a new user`, async () => {
      prisma.user.findFirst = jest.fn().mockResolvedValue(false);
      const response = await service.create(createDtoMock);
      expect(response).toBe(selectedResponseMock);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it(`should get user already created exception`, async () => {
      const { taxId, username, email } = createDtoMock;

      try {
        await service.create(createDtoMock);
      } catch (error) {
        expect(error).toEqual(new ConflictException('User already created'));
      }
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          taxId,
          username,
          email,
        },
      });
    });
  });

  describe('findAll', () => {
    it(`should get all users`, async () => {
      prisma.user.findMany = jest.fn().mockResolvedValue(fakeUsers);
      const response = await service.findAll();
      expect(response).toBe(fakeUsers);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it(`should get one user`, async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(fakeUsers[0]);
      const response = await service.findOne(fakeUsers[0].id);
      expect(response).toBe(fakeUsers[0]);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: fakeUsers[0].id,
        },
        select: prismaSelectQuery,
      });
    });

    it(`should return user already created exception`, async () => {
      try {
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
        await service.findOne(id);
      } catch (error) {
        expect(error).toEqual(new NotFoundException('User not found'));
      }
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: id,
        },
        select: prismaSelectQuery,
      });
    });
  });

  describe('findByUsermame', () => {
    it(`should return user by name`, async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(fakeUsers[0]);
      const response = await service.findByUsername(fakeUsers[0].username);
      expect(response).toBe(fakeUsers[0]);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          username: fakeUsers[0].username,
        },
      });
    });

    describe('update', () => {
      const updateInfos = {
        name: 'test',
        taxId: '123456789',
        username: 'test',
        address: 'test',
        cellphone: 'test',
        email: 'test',
      };
      it(`should update a user`, async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue(fakeUsers[0].id);
        prisma.user.update = jest.fn().mockResolvedValue(fakeUsers[0]);
        const response = await service.update(fakeUsers[0].id, updateInfos);
        expect(response).toBe(fakeUsers[0]);
        expect(prisma.user.update).toHaveBeenCalledTimes(1);
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: {
            id: fakeUsers[0].id,
          },
          data: updateInfos,
          select: prismaSelectQuery,
        });
      });

      it(`should return user not found exception`, async () => {
        try {
          jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
          await service.update(id, updateInfos);
        } catch (error) {
          expect(error).toEqual(new NotFoundException('User not found'));
        }
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: {
            id: id,
          },
        });
      });
    });

    it(`should return user not found exception`, async () => {
      try {
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
        const response = await service.findByUsername(id);
      } catch (error) {
        expect(error).toEqual(new NotFoundException('User not found'));
      }
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          username: id,
        },
      });
    });
  });

  describe('delete', () => {
    it(`should delete a user`, async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(fakeUsers[0]);
      const response = await service.remove(fakeUsers[0].id);
      expect(response).toBe(`This action removes user ${fakeUsers[0].id}`);
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: {
          id: fakeUsers[0].id,
        },
      });
    });

    it(`should return user not found exception`, async () => {
      try {
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error());
        await service.remove(id);
      } catch (error) {
        expect(error).toEqual(new NotFoundException('User not found'));
      }
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: {
          id: id,
        },
      });
    });
  });
});
