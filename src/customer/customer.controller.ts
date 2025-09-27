import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from '../invoice/entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // GET /customers/dropdown?companyId=xxx&search=xxx
  @Get('dropdown')
  async getCustomersForDropdown(
    @Query('company_id', ParseUUIDPipe) company_id: string,
    @Query('search') search?: string
  ): Promise<Customer[]> {
    if (search && search.trim()) {
      return this.customerService.searchCustomersForDropdown(company_id, search.trim());
    }
    
    return this.customerService.findByCompanyIdForDropdown(company_id);
  }

  // GET /customers/invoice/customer-uuid?companyId=company-uuid
  @Get('invoice/:id')
  async getCustomerForInvoice(
    @Param('id', ParseUUIDPipe) customer_id: string,
    @Query('company_id', ParseUUIDPipe) company_id: string
  ): Promise<Customer> {
    return this.customerService.findOneForInvoice(customer_id, company_id);
  }
}
