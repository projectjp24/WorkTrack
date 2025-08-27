import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Roles } from "src/utility/enums/user-roles.enum";

export class CreateUserManagementDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'John Doe', description: 'The name of the user'})
    name: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'johndoe', description: 'The username of the user'})
    username: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'EMP12345', description: 'The employee ID of the user'})
    employeeId: string;
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: 'name@email.com', description: 'The email of the user'})
    email: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'asfsdfd@15W!@15', description: 'The password of the user'})
    password: string;
    @IsNotEmpty()
    @IsString({message: 'Role must be an string'})
    @ApiProperty({example: 'employee', description: 'The role of the user'})
    role: Roles;
}
