import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreatePurchaseOrderItemDto } from "./create-purchase-order-item.dto";
import { CreateVendorDto } from "../../vendor-management/dto/create-vendor.dto";

export class CreatePurchaseOrderDto {
    // @IsString()
    // @IsOptional()
    // @ApiProperty({ example: '5e91975b-66a9-4bc3-ac01-a965fda10557', description: 'UUID of the company' })
    // company_id: string;

    // @IsString()
    // @IsOptional()
    // @ApiProperty({ example: '3150047f-4661-4ec9-a39a-d771ab00d833', description: 'UUID of the vendor' })
    // vendor_id: string;

    @IsString()
    @ApiProperty({ example: 'PO-002/DHPE/25-26/FM7X3A', description: 'Purchase order number' })
    purchase_order_number: string;

    @IsDateString()
    @ApiProperty({ example: '2025-01-01', description: 'Order date in ISO format' })
    order_date: string;

    @IsDateString()
    @ApiProperty({ example: '2025-01-10', description: 'Expected delivery date in ISO format' })
    expected_delivery: string;

      @IsString()
    @IsOptional()
    @ApiProperty({example: 'MG road, indore', description:'shipping address of the vendor'})
    shipping_address: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'MG road, indore', description:'billing address of the vendor'})
    billing_address: string;

    @IsString()
    @ApiProperty({ example: 'Complete', description: 'Status of the purchase order' })
    status: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'something to note or some description', description: 'Additional notes' })
    notes: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '3150047f-4661-4ec9-a39a-d771ab00d833', description: 'User who created this order' })
    created_by: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '3150047f-4661-4ec9-a39a-d771ab00d833', description: 'User who last updated this order' })
    updated_by: string;

    // @IsNumber()
    // @ApiProperty({ example: 100.20, description: 'Subtotal before taxes' })
    // sub_total: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 9, description: 'Central GST percentage' })
    cgst: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 9, description: 'State GST percentage' })
    sgst: number;

    // @IsNumber()
    // @ApiProperty({ example: 120.20, description: 'Total amount including taxes' })
    // total_amount: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseOrderItemDto)
    @ApiProperty({ type: [CreatePurchaseOrderItemDto], description: 'List of purchase order items' })
    items: CreatePurchaseOrderItemDto[];

    @ValidateNested()
    @Type(() => CreateVendorDto)
    @ApiProperty({ type: CreateVendorDto, description: 'Vendor details' })
    vendor: CreateVendorDto;
}
