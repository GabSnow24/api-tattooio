import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseUserObject } from "./dto/response-user.object";
import { User } from "./entities/user.entity";

export const fakeUsers: User[]  = [
    {
        id:"mock",
        name: 'mock',
        taxId: "mock",
        username: 'mock',
        address: 'mock',
        cellphone: 'mock',
        email: 'mock',
        password: 'mock',
        role: "ADMIN",
    },
    {
        id:"mock2",
        name: 'mock2',
        taxId: "mock2",
        username: 'mock2',
        address: 'mock2',
        cellphone: 'mock2',
        email: 'mock2',
        password: 'mock2',
        role: "ADMIN",
    }
  ];
  
export const createDtoMock: CreateUserDto = {
    name: 'mock',
    username: 'mock',
    address: 'mock',
    cellphone: 'mock',
    email: 'mock',
    taxId: 'mock',
    password: 'mock'
  }

export const selectedResponseMock: ResponseUserObject = {
    id: 'mock',
    name: 'mock',
    cellphone: 'mock',
    username: 'mock',
    address: 'mock',
    email: 'mock',
    role: 'ADMIN'
  }

export const prismaMock = {
    user: {
      create: jest.fn().mockReturnValue(selectedResponseMock),
      findMany: jest.fn().mockResolvedValue(fakeUsers),
      findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
      findFirst: jest.fn().mockResolvedValue(fakeUsers[0]),
      update: jest.fn().mockResolvedValue(fakeUsers[0]),
      delete: jest.fn(), 
    },
  };
