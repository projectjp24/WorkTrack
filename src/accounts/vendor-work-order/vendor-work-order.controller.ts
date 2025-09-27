import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendorWorkOrderService } from './vendor-work-order.service';
import { CreateVendorWorkOrderDto } from './dto/create-vendor-work-order.dto';
import { UpdateVendorWorkOrderDto } from './dto/update-vendor-work-order.dto';

@Controller('vendor-work-order')
export class VendorWorkOrderController {
  constructor(private readonly vendorWorkOrderService: VendorWorkOrderService) {}

  @Post()
  create(@Body() createVendorWorkOrderDto: CreateVendorWorkOrderDto) {
    return this.vendorWorkOrderService.create(createVendorWorkOrderDto);
  }

  @Get()
  findAll() {
    return this.vendorWorkOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorWorkOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorWorkOrderDto: UpdateVendorWorkOrderDto) {
    return this.vendorWorkOrderService.update(+id, updateVendorWorkOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorWorkOrderService.remove(+id);
  }
}
