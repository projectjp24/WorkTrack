import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';

@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post('create/:company_id')
  create(
    @Param('company_id') company_id: string,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    return this.purchaseOrderService.createPurchaseOrder(
      createPurchaseOrderDto,
      company_id,
    );
  }

  @Get('all/:company_id')
  findAll(@Param('company_id') company_id: string) {
    return this.purchaseOrderService.findAll(company_id);
  }

  @Patch('update/:purchase_order_id/:company_id') 
  update(
    @Param('purchase_order_id') purchase_order_id: string,
    @Param('company_id') company_id:string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return this.purchaseOrderService.updatePurchaseOrder(purchase_order_id, updatePurchaseOrderDto, company_id);
  }

  @Delete('delete/:purchase_order_id/:company_id')
  remove(@Param('purchase_order_id') purchase_order_id: string, @Param('company_id') company_id: string) {
    return this.purchaseOrderService.softDelete(purchase_order_id, company_id);
  }

  @Get('get_purchase_order_detail/:purchase_order_id/:company_id')
  findOne(@Param('purchase_order_id') purchase_order_id: string, @Param('company_id') company_id: string) {
    return this.purchaseOrderService.findOne(purchase_order_id, company_id);
  }
}
