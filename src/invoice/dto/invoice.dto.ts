import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CustomerDto } from "./customer.dto";
import { ProjectDto } from "./project.dto";
import { InvoiceItemDto } from "./invoice-item.dto";
import { IsOptional } from "class-validator";


export class InvoiceResponseDto {
  @ApiProperty({ description: 'Invoice UUID', example: 'b47ac10b-58cc-4372-a567-0e02b2c3d481' })
  @IsOptional()
  invoice_id: string;

  @ApiProperty({ description: 'Invoice type', example: 'tax_invoice' })
  invoice_type: string;

  @ApiProperty({ description: 'Invoice reference number', example: 'INV-2025-001' })
  reference_number: string;

  @ApiProperty({ description: 'Invoice date', example: '2025-09-17' })
  invoice_date: string;

  @ApiProperty({ description: 'Total invoice amount', example: 59000.00 })
  total_amount: number;

  @ApiProperty({ description: 'Invoice status', example: 'draft' })
  status: string;

  @ApiProperty({ description: 'Customer details', type: CustomerDto })
  customer: CustomerDto;

  @ApiPropertyOptional({ description: 'Project details', type: ProjectDto })
  project?: ProjectDto;

  @ApiProperty({ description: 'Invoice line items', type: [InvoiceItemDto] })
  items: InvoiceItemDto[];

  @ApiProperty({ description: 'Record creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updated_at: Date;
}