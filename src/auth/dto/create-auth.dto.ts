import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({example: 'username / empid', description: 'please provide employee id or username' })
  identifier: string; // Can be either username or employeeId

  @IsNotEmpty()
  @IsString()
  @ApiProperty({example: 'password', description: 'please provide password' })
  password: string;
}