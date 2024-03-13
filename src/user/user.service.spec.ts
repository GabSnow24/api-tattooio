import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { createDtoMock, fakeUsers, prismaMock, selectedResponseMock } from './user.mock';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: prismaMock },],
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
      prisma.user.findFirst = jest.fn().mockResolvedValue(false)
      const response = await service.create(createDtoMock);
      expect(response).toBe(selectedResponseMock);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it(`should get user already created exception`, async () => {
      const {taxId, username, email } = createDtoMock

      try {
        await service.create(createDtoMock);
      } catch (error) {
        expect(error).toEqual(new ConflictException('User already created'));
      }
      
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          taxId,
          username,
          email
        }
      });
    });
  });
});
