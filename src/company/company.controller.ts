import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully', type: Company })
  async create(@Body() dto: CreateCompanyDto): Promise<Company> {
    return await this.companyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'List of companies', type: [Company] })
  async findAll(): Promise<Company[]> {
    return await this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({ status: 200, description: 'Company found', type: Company })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findOne(@Param('id') id: string): Promise<Company> {
    return await this.companyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a company by ID' })
  @ApiResponse({ status: 200, description: 'Company updated', type: Company })
  async update(@Param('id') id: string, @Body() dto: UpdateCompanyDto): Promise<Company> {
    return await this.companyService.update(id, dto);
  }

 @Delete(':id')
@ApiOperation({ summary: 'Soft delete a company by ID (mark as deleted instead of removing)' })
@ApiResponse({ status: 200, description: 'Company soft deleted' })
@ApiResponse({ status: 404, description: 'Company not found' })
async remove(@Param('id') id: string): Promise<{ message: string }> {
  // until you integrate user management, use dummy userId
  const userId = '00000000-0000-0000-0000-000000000001';

  await this.companyService.remove(id, userId);

  return { message: `Company ${id} marked as deleted successfully` };
}
}
