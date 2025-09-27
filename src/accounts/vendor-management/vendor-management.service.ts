import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorManagementDto } from './dto/update-vendor-management.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from './entities/vendor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendorManagementService {
  constructor(
    @InjectRepository(VendorEntity)
    private vendorRepository: Repository<VendorEntity>,
  ) {}
  async create(CreateVendorDto: CreateVendorDto, company_id: string) {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: {
          company_id: company_id,
          vendor_detail_id: CreateVendorDto.vendor_detail_id,
        },
      });

      if (vendor) throw new ConflictException('Vendor already exists');

      const newVendor = this.vendorRepository.create(CreateVendorDto);

      await this.vendorRepository.save(newVendor);

      return { message: 'Vendor created successfully', data: newVendor };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(company_id: string) {
    const vendors = await this.vendorRepository.find({
      where: { is_delete: false, company_id},
    });

    if (!vendors) throw new NotFoundException('No vendors found');

    return vendors;
  }

  async findOne(vendor_id: string, company_id: string) {
    const vendor = await this.vendorRepository.findOne({
      where: { vendor_id, company_id, is_delete: false },
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    return vendor;
  }

  async update(vendor_id: string, company_id: string, fields: Partial<UpdateVendorManagementDto>) {
    const vendor = await this.findOne(vendor_id, company_id) 

    if (!vendor) throw new NotFoundException('Vendor not found');

    Object.assign(vendor, fields);
    await this.vendorRepository.save(vendor);
    return { message: 'Vendor updated successfully', data: vendor };
  }

  async activeFindAll(company_id: string) {
    const vendors = await this.vendorRepository.find({
      where: { is_delete: false, company_id, status: 'Active'},
    });

    if (!vendors) throw new NotFoundException('No vendors found');

    return vendors;
  }

  async remove(vendor_id: string, company_id: string) {
    const vendor = await this.findOne(vendor_id, company_id) 

    if (!vendor) throw new NotFoundException('Vendor not found');

    await this.vendorRepository.update(vendor_id,{
      is_delete: true,
      is_active: false,
      status: 'inactive',
    });

    return { message: 'Vendor has been deleted successfully.' };
  }
}
