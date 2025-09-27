// create-payment-log.dto.ts
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePaymentLogDto {
  @ApiProperty({ 
    description: 'Payment type', 
    enum: ['Inflow', 'Outflow'], 
    example: 'Inflow' 
  })
  @IsEnum(['Inflow', 'Outflow'])
  type: 'Inflow' | 'Outflow';

  @ApiProperty({ description: 'Payment date', example: '2025-09-26' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Payment amount', example: 20000.00 })
  @IsNumber()
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  amount: number;

  @ApiPropertyOptional({ description: 'Payment description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Linked document ID', example: 'INV-001' })
  @IsOptional()
  @IsString()
  linked_doc_id?: string;
}



export class UpdatePaymentLogDto extends PartialType(CreatePaymentLogDto) {}
