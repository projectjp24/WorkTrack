import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";



export class ProjectExpenseCategory{
      @IsUUID()
        @IsOptional()
        company_id: string
        
        @IsString()
        @IsNotEmpty()
        expense_category_name: string;
    
        @IsNumber()
        @Min(0)
        budgeted_amount: number;
    }

    export class UpdateExpenseCategoryDto extends PartialType(ProjectExpenseCategory) {}
