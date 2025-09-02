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
  ) { }


  async create(dto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepo.create(dto);
    return await this.companyRepo.save(company);
  }


  async findAll(): Promise<Company[]> {
    return await this.companyRepo.find({
      relations: ['company_type', 'branches'],
      order: { createdAt: 'DESC' },
    });
  }


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


  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, dto);
    return await this.companyRepo.save(company);
  }


  async remove(id: string, userId: string): Promise<void> {
    const company = await this.companyRepo.findOne({
      where: { company_id: id, is_deleted: false },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    company.is_deleted = true;
    company.is_active = false;
     company.status = 'Inactive'; 
    company.updated_by = userId;
    // company.createdAt = new Date();
    await this.companyRepo.save(company);

    await this.companyRepo.save(company);
  }

  async findAllWithDetails(): Promise<Company[]> {
  return this.companyRepo.find({
    relations: ['branches', 'company_type', 'bankAccounts'],
  });
}

async findByIdWithDetails(company_id: string): Promise<Company> {
  const company = await this.companyRepo.findOne({
    where: { company_id },
    relations: ['branches', 'company_type', 'bankAccounts'],
  });
  if (!company) {
    throw new NotFoundException(`Company with ID ${company_id} not found`);
  }
  return company;

}
}