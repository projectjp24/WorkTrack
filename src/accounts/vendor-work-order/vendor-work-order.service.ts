import { Injectable } from '@nestjs/common';
import { CreateVendorWorkOrderDto } from './dto/create-vendor-work-order.dto';
import { UpdateVendorWorkOrderDto } from './dto/update-vendor-work-order.dto';

@Injectable()
export class VendorWorkOrderService {
  create(createVendorWorkOrderDto: CreateVendorWorkOrderDto) {
    return 'This action adds a new vendorWorkOrder';
  }

  findAll() {
    return `This action returns all vendorWorkOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vendorWorkOrder`;
  }

  update(id: number, updateVendorWorkOrderDto: UpdateVendorWorkOrderDto) {
    return `This action updates a #${id} vendorWorkOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendorWorkOrder`;
  }
}
