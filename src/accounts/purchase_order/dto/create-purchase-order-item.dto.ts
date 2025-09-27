import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePurchaseOrderItemDto{
    // @IsString()
    // @IsOptional()
    // @ApiProperty({example: '5e91975b-66a9-4bc3-ac01-a965fda10557', description:'uuid of company'})
    // company_id: string;

    // @IsString()
    // @IsOptional()
    // @ApiProperty({example: '5e91975b-66a9-4bc3-ac01-a965fda10557', description:'uuid of purchase order'})
    // purchase_order_id: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'cement', description:'name of item'})
    item_name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'Good Quality, water proof', description:'description of item'})
    description: string;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'HSN/SAC', description:'hsc/sac of the item'})
    hsn_sac: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({example: '3', description:'quantity of the item'})
    quantity: number;

    @IsString()
    @IsOptional()
    @ApiProperty({example: 'nos', description:'unit of the item'})
    unit: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({example: '30', description:'per unit rate of the item'})
    unit_price: number;
  purchase_order_item_id: any;

    // @IsNumber()
    // @IsOptional()
    // @ApiProperty({example: '300', description:'amount of the item'})
    // amount: number;
}