import { $Enums } from "@prisma/client";
import { User } from "../entities/user.entity";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, IsTaxId } from "class-validator";

export class CreateUserDto extends User{
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly address: string;

    @IsPhoneNumber('BR')
    @IsNotEmpty()
    readonly cellphone: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsTaxId("pt-BR")
    @IsNotEmpty()
    readonly taxId: string;

    @IsStrongPassword()
    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsEnum($Enums.Role)
    @IsNotEmpty()
    readonly role?: $Enums.Role;
}
