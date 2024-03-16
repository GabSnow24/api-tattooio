import { $Enums, Prisma } from '@prisma/client';

export class User implements Prisma.UserUncheckedCreateInput {
  id?: string;
  name: string;
  taxId: string;
  cellphone: string;
  username: string;
  address: string;
  email: string;
  password: string;
  role?: $Enums.Role;
  schedules?: Prisma.ScheduleUncheckedCreateNestedManyWithoutSchedulerInput;
}
