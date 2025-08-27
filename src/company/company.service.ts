import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  //  Create a new company
  async create(dto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepo.create(dto);
    return await this.companyRepo.save(company);
  }

  //  Get all companies (with relations: type, branches)
  async findAll(): Promise<Company[]> {
    return await this.companyRepo.find({
      relations: ['company_type', 'branches'],
      order: { created_at: 'DESC' },
    });
  }

  //  Get one company by ID
  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepo.findOne({
      where: { company_id: id },
      relations: ['company_type', 'branches'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  //  Update company
  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, dto);
    return await this.companyRepo.save(company);
  }

  //  Soft delete company
async remove(id: string, userId: string): Promise<void> {
  const company = await this.companyRepo.findOne({
    where: { company_id: id, is_deleted: false },
  });

  if (!company) {
    throw new NotFoundException(`Company with ID ${id} not found`);
  }


  company.updated_by = userId;
  company.updated_at = new Date();

  await this.companyRepo.save(company);
}
}