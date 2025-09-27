import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorWorkOrderDto } from './create-vendor-work-order.dto';

export class UpdateVendorWorkOrderDto extends PartialType(CreateVendorWorkOrderDto) {}
