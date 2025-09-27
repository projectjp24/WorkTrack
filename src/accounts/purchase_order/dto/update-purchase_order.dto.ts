import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderDto } from './create-purchase_order.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePurchaseOrderDto extends PartialType(
  CreatePurchaseOrderDto,
) {
  @IsNumber()
  @IsOptional()
  cgst: number;

  @IsNumber()
  @IsOptional()
  sgst: number;
  
}
