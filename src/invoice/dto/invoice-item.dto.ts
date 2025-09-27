
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from "class-validator";



export class InvoiceItemDto {
  @ApiPropertyOptional({ description: 'Item code', example: 'SERV-001' })
  @IsOptional()
  @IsString()
  item_code?: string;


  @ApiPropertyOptional({ description: 'Item name', example: 'Web Development Service' })
  @IsOptional()
  @IsString()
  item_name?: string;

  @ApiProperty({ description: 'Item description', example: 'Full-stack web development services' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'HSN/SAC code', example: '998314' })
  @IsOptional()
  @IsString()
  hsn_sac?: string;

  @ApiPropertyOptional({ description: 'Unit of measurement', example: 'Nos' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ description: 'Quantity', example: 1.000 })
  @IsNumber()
  @Min(0.001)
  @Transform(({ value }) => parseFloat(value))
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 50000.00 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  unit_price: number;

  @ApiProperty({ description: 'Line amount (quantity × unit_price)', example: 50000.00 })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  amount: number;

  @ApiPropertyOptional({ description: 'Discount percentage', example: 0.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  discount_percentage?: number;

  @ApiPropertyOptional({ description: 'Discount amount', example: 0.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  discount_amount?: number;

  @ApiProperty({ description: 'Taxable amount', example: 50000.00 })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  taxable_amount: number;

  @ApiPropertyOptional({ description: 'Tax rate percentage', example: 18.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  tax_rate?: number;

  @ApiPropertyOptional({ description: 'Tax amount', example: 9000.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  tax_amount?: number;

  @ApiProperty({ description: 'Total line amount including tax', example: 59000.00 })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  total_amount: number;
}