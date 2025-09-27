// create-actual-entry.dto.ts
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateActualEntryDto {
  @ApiProperty({ 
    description: 'Entry type', 
    enum: ['Income', 'Expense'], 
    example: 'Income' 
  })
  @IsEnum(['Income', 'Expense'])
  type: 'Income' | 'Expense';

  @ApiProperty({ description: 'Entry date', example: '2025-09-26' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Entry amount', example: 5000.00 })
  @IsNumber()
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  amount: number;

  @ApiPropertyOptional({ description: 'Entry description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Linked document ID', example: 'INV-001' })
  @IsOptional()
  @IsString()
  linked_doc_id?: string;

  @ApiPropertyOptional({ description: 'Income category ID (required for Income entries)' })
  @IsOptional()
  @IsUUID()
  income_category_id?: string;

  @ApiPropertyOptional({ description: 'Expense category ID (required for Expense entries)' })
  @IsOptional()
  @IsUUID()
  expense_category_id?: string;
}


export class UpdateActualEntryDto extends PartialType(CreateActualEntryDto) {}
