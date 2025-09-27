import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VendorManagementService } from './vendor-management.service';
import { UpdateVendorManagementDto } from './dto/update-vendor-management.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Controller('vendor-management')
export class VendorManagementController {
  constructor(
    private readonly vendorManagementService: VendorManagementService,
  ) {}

  @Post('create/:company_id')
  create(
    @Param('company_id') company_id: string,
    @Body() createVendorManagementDto: CreateVendorDto,
  ) {
    return this.vendorManagementService.create(
      createVendorManagementDto,
      company_id,
    );
  }

  @Get('getAll/:company_id')
  findAll(@Param('company_id') company_id: string) {
    return this.vendorManagementService.findAll(company_id);
  }

  @Get('get/:vendor_id/:company_id')
  findOne(
    @Param('vendor_id') vendor_id: string,
    @Param('company_id') company_id: string,
  ) {
    return this.vendorManagementService.findOne(vendor_id, company_id);
  }

  @Patch('update/:vendor_id/:company_id')
  update(
    @Param('vendor_id') vendor_id: string,
    @Param('company_id') company_id: string,
    @Body() updateVendorManagementDto: UpdateVendorManagementDto,
  ) {
    return this.vendorManagementService.update(
      vendor_id,
      company_id,
      updateVendorManagementDto,
    );
  }

  @Get('getAllActive/:company_id')
  activeFindAll(@Param('company_id') company_id: string) {
    return this.vendorManagementService.activeFindAll(company_id);
  }

  @Delete('delete/:vendor_id/:company_id')
  remove(
    @Param('vendor_id') vendor_id: string,
    @Param('company_id') company_id: string,
  ) {
    return this.vendorManagementService.remove(vendor_id, company_id);
  }
}
