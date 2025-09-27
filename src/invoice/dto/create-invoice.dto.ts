import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from "class-validator";
import { CustomerDto } from "./customer.dto";
import { ProjectDto } from "./project.dto";
import { InvoiceItemDto } from "./invoice-item.dto";

export class CreateCompleteInvoiceDto {
  @ApiPropertyOptional({ description: 'Invoice type', enum: ['tax_invoice', 'proforma', 'quotation', 'credit_note', 'debit_note'], example: 'tax_invoice' })
  @IsOptional()
  @IsEnum(['tax_invoice', 'proforma', 'quotation', 'credit_note', 'debit_note'])
  invoice_type?: string;


  @ApiProperty({ description: 'Unique invoice reference number', example: 'INV-2025-001' })
  @IsString()
  reference_number?: string | null;

  @ApiProperty({ description: 'Invoice date', example: '2025-09-17' })
  @IsDateString()
  invoice_date: string;

  @ApiPropertyOptional({ description: 'Bill for month', example: '2025-09-01' })
  @IsOptional()
  @IsDateString()
  bill_for_month?: string;

  @ApiPropertyOptional({ description: 'Billing period start date', example: '2025-09-01' })
  @IsOptional()
  @IsDateString()
  bill_period_start?: string;

  @ApiPropertyOptional({ description: 'Billing period end date', example: '2025-09-30' })
  @IsOptional()
  @IsDateString()
  bill_period_end?: string;

  @ApiPropertyOptional({ description: 'Payment due date', example: '2025-10-17' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiPropertyOptional({ description: 'Whether this is an RA (Running Account) bill', example: false })
  @IsOptional()
  @IsBoolean()
  is_ra_bill?: boolean;


  @ApiProperty({ description: 'Customer details', type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;


  @ApiPropertyOptional({ description: 'Project details', type: ProjectDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectDto)
  project?: ProjectDto;


  @ApiPropertyOptional({ description: 'Invoice subtotal amount', example: 50000.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  subtotal?: number;

  @ApiPropertyOptional({ description: 'Discount amount', example: 0.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  discount_amount?: number;

  @ApiPropertyOptional({ description: 'Taxable amount', example: 50000.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  taxable_amount?: number;

  @ApiPropertyOptional({ description: 'SGST rate percentage', example: 9.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  sgst_rate?: number;

  @ApiPropertyOptional({ description: 'CGST rate percentage', example: 9.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  cgst_rate?: number;

  @ApiPropertyOptional({ description: 'SGST amount', example: 4500.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  sgst_amount?: number;

  @ApiPropertyOptional({ description: 'CGST amount', example: 4500.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  cgst_amount?: number;

  @ApiPropertyOptional({ description: 'Total tax amount', example: 9000.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  total_tax_amount?: number;

  @ApiPropertyOptional({ description: 'Total invoice amount', example: 59000.00 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  total_amount?: number;

  // Status
  @ApiPropertyOptional({ description: 'Invoice status', enum: ['draft', 'sent', 'acknowledged', 'approved', 'paid', 'overdue', 'cancelled'], example: 'draft' })
  @IsOptional()
  @IsEnum(['draft', 'sent', 'acknowledged', 'approved', 'paid', 'overdue', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({ description: 'Payment status', enum: ['unpaid', 'partial', 'paid', 'overdue'], example: 'unpaid' })
  @IsOptional()
  @IsEnum(['unpaid', 'partial', 'paid', 'overdue'])
  payment_status?: string;

  @ApiPropertyOptional({ description: 'Currency code', example: 'INR' })
  @IsOptional()
  @IsString()
  currency_code?: string;

  @ApiPropertyOptional({ description: 'Notes and terms & conditions' })
  @IsOptional()
  @IsString()
  notes_terms_conditions?: string;

  @ApiPropertyOptional({ description: 'User who created the record', example: 'user123' })
  @IsOptional()
  @IsString()
  @IsUUID()
  created_by?: string;

  @ApiPropertyOptional({ description: 'User who last updated the record', example: 'user123' })
  @IsOptional()
  @IsString()
  @IsUUID()
  updated_by?: string;

  @ApiProperty({ description: 'Invoice line items', type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiProperty({ description: 'Record creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updated_at: Date;
}

export class UpdateCompleteInvoiceDto extends PartialType(CreateCompleteInvoiceDto) { }


