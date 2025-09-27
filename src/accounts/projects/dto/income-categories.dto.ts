import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";



export class CreateIncomeCategoryDto {

    @IsUUID()
    @IsOptional()
    company_id: string

    @IsString()
    @IsNotEmpty()
    income_category_name: string;

    @IsNumber()
    @Min(0)
    budgeted_amount: number;
}

export class UpdateIncomeCategoryDto extends PartialType(CreateIncomeCategoryDto) {}