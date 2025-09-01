import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'EMP12345', description: 'The employee ID of the user'})
    employee_id: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'sdfgsff5gs5fg', description: 'The company ID of the user'})
    company_id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'John', description: 'The first name of the user'})
    first_name: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'Doe', description: 'The last name of the user'})
    last_name: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'johndoe', description: 'The username of the user'})
    username: string;
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: 'name@email.com', description: 'The email of the user'})
    email: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'password@123', description: 'The email of the user'})
    password: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'test colony ', description: 'The email of the user'})
    address: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: '7485969887 ', description: 'Phone number of the user'})
    phone_number: string;
    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({example: 'test colony ', description: 'The email of the user'})
    date_of_birth: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'sdfgsff5gs5fg', description: 'The employee ID of the user'})
    department_id: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'sdfgsff5gs5fg', description: 'The employee ID of the user'})
    status: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'sdfgsff5gs5fg', description: 'The employee ID of the user'})
    role_id: string;
    @IsString()
    @ApiProperty({example: "adjflaksdfkaksd", description: 'The active status of the user'})
    branch_id?: string;
}
