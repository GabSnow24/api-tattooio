import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  createDtoMock,
  fakeUsers,
  prismaMock,
  selectedResponseMock,
} from './user.mock';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
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
      });
    });

    it(`should return nothing when post is not found`, async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      const response = await service.findOne('23');
      expect(response).toBe(null);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: '23',
        },
      });
    });
  });
});
