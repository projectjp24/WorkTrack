import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsUUID()
    @Transform(({ value }) => (value === '' ? undefined : value))  // convert '' -> undefined
    department_id?: string;
}
