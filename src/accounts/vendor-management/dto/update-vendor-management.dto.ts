import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';

export class UpdateVendorManagementDto extends PartialType(CreateVendorDto) {}
