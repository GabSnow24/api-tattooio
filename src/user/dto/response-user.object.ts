import { $Enums } from "@prisma/client";

export class ResponseUserObject {
    readonly id: string;

    readonly name: string;

    readonly cellphone: string;

    readonly username: string;

    readonly address: string;
    
    readonly email: string;

    readonly role: $Enums.Role;
}
