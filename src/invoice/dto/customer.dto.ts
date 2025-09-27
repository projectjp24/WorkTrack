import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {  IsBoolean, IsOptional, IsString, IsUUID, } from "class-validator";


export class CustomerDto {
  @ApiPropertyOptional({ description: 'Customer UUID if using existing customer', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsOptional()
  @IsUUID()
  customer_id?: string | null; 

  @ApiProperty({ description: 'Customer name', example: 'ABC Corporation' })
  @IsString()
  customer_name: string;

  @ApiPropertyOptional({ description: 'Customer email', example: 'contact@abc.com' })
  @IsOptional()
  @IsString()
  customer_email?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  customer_phone?: string;

  @ApiPropertyOptional({ description: 'Customer address' })
  @IsOptional()
  @IsString()
  customer_address?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Mumbai' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State', example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'PIN code', example: '400001' })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiPropertyOptional({ description: 'GST identification number', example: '27ABCDE1234F1Z5' })
  @IsOptional()
   @IsString()
  customer_gstin?: string;

  @ApiPropertyOptional({ description: 'PAN number', example: 'ABCDE1234F' })
  @IsOptional()
  @IsString()
  pan_number?: string;

  @ApiPropertyOptional({ description: 'Whether customer is active', example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
