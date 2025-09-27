import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { PurchaseOrderController } from './purchase_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderEntity } from './entities/purchase_order.entity';
import { PurchaseOrderItemEntity } from './entities/purchase_order_item.entity';
import { VendorEntity } from '../vendor-management/entities/vendor.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PurchaseOrderEntity, PurchaseOrderItemEntity, VendorEntity])],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
