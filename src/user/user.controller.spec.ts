import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserObject } from './dto/response-user.object';
import { PrismaService } from '../prisma/prisma.service';
import { createDtoMock, selectedResponseMock } from './user.mock';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return user on creation', async () => {
      jest.spyOn(service, 'create').mockImplementation((): Promise<any> => Promise.resolve(selectedResponseMock));
      expect(await controller.create(createDtoMock)).toBe(selectedResponseMock);
    });
  });
});
