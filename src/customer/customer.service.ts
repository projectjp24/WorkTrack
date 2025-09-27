import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../invoice/entities/customer.entity';
// import { Customer } from './customer.entity'; // Your existing entity

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  // Get customers for dropdown (minimal data)
  async findByCompanyIdForDropdown(company_id: string): Promise<Customer[]> {
    if (!company_id) {
      throw new BadRequestException('Company ID is required');
    }

    return this.customerRepository.find({
      where: { 
        company_id: company_id,
        is_active: true,
      },
      select: [
        'customer_id',
        'customer_code', 
        'customer_name',
        'customer_email',
        'customer_phone'
      ],
      order: { customer_name: 'ASC' }
    });
  }

  // Get full customer details for invoice auto-fill
  async findOneForInvoice(customerId: string, company_id: string): Promise<Customer> {
    if (!customerId || !company_id) {
      throw new BadRequestException('Customer ID and Company ID are required');
    }

    const customer = await this.customerRepository.findOne({
      where: { 
        customer_id: customerId,
        company_id: company_id,
        is_active: true
      }
    });

    if (!customer) {
      throw new NotFoundException('Customer not found or access denied');
    }

    return customer;
  }

  // Search customers by name or code
 async searchCustomersForDropdown(company_id: string, searchTerm: string): Promise<Customer[]> {
  if (!company_id) {
    throw new BadRequestException('Company ID is required');
  }

  if (!searchTerm || searchTerm.trim().length < 2) {
    return this.findByCompanyIdForDropdown(company_id);
  }

  return this.customerRepository
    .createQueryBuilder('customer')
    .where('customer.company_id = :company_id', { company_id: company_id }) // FIXED: Use companyId as parameter name
    .andWhere('customer.is_active = :isActive', { isActive: true })
    .andWhere(
      '(LOWER(customer.customer_name) LIKE LOWER(:searchTerm) OR LOWER(customer.customer_code) LIKE LOWER(:searchTerm))',
      { searchTerm: `%${searchTerm.trim()}%` }
    )
    .select([
      'customer.customer_id',
      'customer.customer_code',
      'customer.customer_name',
      'customer.customer_email',
      'customer.customer_phone'
    ])
    .orderBy('customer.customer_name', 'ASC')
    .limit(20)
    .getMany();
}
}
