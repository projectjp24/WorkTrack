import { Module } from '@nestjs/common';
import { VendorWorkOrderService } from './vendor-work-order.service';
import { VendorWorkOrderController } from './vendor-work-order.controller';

@Module({
  controllers: [VendorWorkOrderController],
  providers: [VendorWorkOrderService],
})
export class VendorWorkOrderModule {}
