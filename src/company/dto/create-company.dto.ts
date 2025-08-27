import { IsEmail, IsOptional, IsString, IsUUID, Length, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Name of the company', example: 'TechCorp Pvt Ltd' })
  @IsString()
  @Length(2, 50)
  company_name: string;

  @ApiProperty({ description: 'Unique company registration number', example: 'REG12345XYZ' })
  @IsString()
  @Length(5, 50)
  registration_no: string;

  @ApiPropertyOptional({ description: 'GST number of the company', example: '22AAAAA0000A1Z5' })
  @IsOptional()
  @Length(15, 20)
  gst_number?: string;

  @ApiPropertyOptional({ description: 'PAN number of the company', example: 'ABCDE1234F' })
  @IsOptional()
  @Length(10, 20)
  pan_number?: string;

  @ApiPropertyOptional({ description: 'Company logo URL', example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @ApiProperty({ description: 'User ID of creator (UUID)', example: 'a3e8d7c1-5c73-4d2c-bb93-12cdd9f4567a' })
  @IsUUID()
  created_by: string;

  @ApiProperty({ description: 'User ID of updater (UUID)', example: 'b4f2e6d9-8a12-41e0-bbe3-98ad5f9cd567' })
  @IsUUID()
  updated_by: string;

  @ApiPropertyOptional({ description: 'Official company email address', example: 'info@techcorp.com' })
  @IsOptional()
  @IsEmail()
  company_email?: string;

  @ApiPropertyOptional({ description: 'Company type ID (FK to company_types)', example: 'f7a9bcd2-0e32-45b1-bc9e-f8f23456789a' })
  @IsOptional()
  @IsUUID()
  company_type_id?: string;

  @ApiPropertyOptional({ description: 'Company phone number', example: '+91-9876543210' })
  @IsOptional()
  @Length(10, 20)
  company_phone?: string;

  @ApiPropertyOptional({ description: 'Registered company address', example: '123, Industrial Area, Delhi' })
  @IsOptional()
  @IsString()
  company_address?: string;

  @ApiPropertyOptional({ description: 'Company status', example: 'active', default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Company website URL', example: 'https://www.techcorp.com' })
  @IsOptional()
  @IsUrl()
  company_website_url?: string;
}
