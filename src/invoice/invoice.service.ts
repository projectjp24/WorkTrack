import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "./entities/invoice.entity";
import { DataSource, Repository } from "typeorm";
import { Customer } from "./entities/customer.entity";
import { InvoiceItem } from "./entities/invoice-item.entity";
import { Project } from "./entities/project.entity";
import { CreateCompleteInvoiceDto, UpdateCompleteInvoiceDto } from "./dto/create-invoice.dto";
import { CompanyBankEntity } from "src/company/entities/company-bank-details.entity";

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(CompanyBankEntity)
    private companyBankRepository: Repository<CompanyBankEntity>,
    private dataSource: DataSource,
  ) {}

  async createInvoice(createInvoiceDto: CreateCompleteInvoiceDto, company_id: string): Promise<Invoice> {
    return await this.dataSource.transaction(async manager => {
      let customer: Customer;

      if (createInvoiceDto.customer.customer_id) {
        const foundCustomer = await manager.findOne(Customer, {
          where: { customer_id: createInvoiceDto.customer.customer_id, company_id }
        });

        if (!foundCustomer) {
          throw new NotFoundException('Customer not found');
        }
        customer = foundCustomer;

      } else {
        // Check if customer exists by GSTIN first
        const existingCustomer = await manager.findOne(Customer, {
          where: {
            customer_gstin: createInvoiceDto.customer.customer_gstin,
            company_id
          }
        });

        if (existingCustomer) {
          customer = existingCustomer;
        } else {
          // Create new customer
          const { customer_id, ...customerData } = createInvoiceDto.customer;

          // Generate customer code
          const lastCustomer = await manager.findOne(Customer, {
            where: { company_id },
            order: { created_at: 'DESC' }
          });
          let nextNumber = 1;
          if (lastCustomer && lastCustomer.customer_code) {
            const match = lastCustomer.customer_code.match(/(\d+)/);
            if (match) {
              nextNumber = parseInt(match[1]) + 1;
            }
          }
          const customerCode = `CUST${String(nextNumber).padStart(4, '0')}`;

          customer = manager.create(Customer, {
            ...customerData,
            company_id,
            customer_code: customerCode,
          });
          customer = await manager.save(customer);
        }
      }

      // Handle project creation or retrieval (if provided)
      let project: Project | undefined;
      if (createInvoiceDto.project) {
        if (createInvoiceDto.project.project_id) {
          const foundProject = await manager.findOne(Project, {
            where: {
              project_id: createInvoiceDto.project.project_id,
              company_id
            }
          });
          project = foundProject ?? undefined;

          if (!project) {
            throw new NotFoundException('Project not found');
          }
        } else {
          // Create new project
          const { project_id, ...projectData } = createInvoiceDto.project;
          project = manager.create(Project, {
            ...projectData,
            company_id,
            customer_id: String(customer.customer_id),
            ...(typeof project_id === 'string' && project_id !== '' ? { project_id } : {}),
          });
          project = await manager.save(project);
        }
      }

      // Generate invoice reference number
      let referenceNumber = createInvoiceDto.reference_number;
      if (!referenceNumber) {
        const year = new Date().getFullYear();
        const lastInvoice = await manager.findOne(Invoice, {
          where: { company_id },
          order: { updated_at: 'DESC' }
        });
        let nextNumber = 1;
        if (lastInvoice && lastInvoice.refrence_number) {
          const match = lastInvoice.refrence_number.match(/^(\d+)/);
          if (match) {
            nextNumber = parseInt(match[1]) + 1;
          }
        }
        referenceNumber = `${String(nextNumber).padStart(3, '0')}/DHPE/${year.toString().slice(-2)}-${(year + 1).toString().slice(-2)}/UIED1R`;
      }

      // Calculate totals
      const subtotal = createInvoiceDto.items.reduce((sum, item) => {
        const quantity = item.quantity || 1;
        const unitPrice = item.unit_price || 0;
        const discountAmount = item.discount_amount || 0;
        return sum + (quantity * unitPrice) - discountAmount;
      }, 0);

      const sgstRate = createInvoiceDto.sgst_rate || 0;
      const cgstRate = createInvoiceDto.cgst_rate || 0;
      const sgstAmount = (subtotal * sgstRate) / 100;
      const cgstAmount = (subtotal * cgstRate) / 100;
      const totalTaxAmount = sgstAmount + cgstAmount;
      const totalAmount = subtotal + totalTaxAmount;

      // Convert amount to words
      const numWords = require('number-to-words');
      const amountInWords = `${numWords.toWords(Math.floor(totalAmount)).replace(/\b\w/g, l => l.toUpperCase())} Only`;

      // Create invoice entity
      const invoice = manager.create(Invoice, {
        company_id,
        document_type: createInvoiceDto.invoice_type === 'tax_invoice' ? 'Tax Invoice' : 'Tax Invoice',
        refrence_number: referenceNumber,
        invoice_date: createInvoiceDto.invoice_date,
        bill_for_month: createInvoiceDto.bill_for_month ? new Date(createInvoiceDto.bill_for_month) : undefined,
        bill_period_start: createInvoiceDto.bill_period_start ? new Date(createInvoiceDto.bill_period_start) : undefined,
        bill_period_end: createInvoiceDto.bill_period_end ? new Date(createInvoiceDto.bill_period_end) : undefined,
        due_date: createInvoiceDto.due_date ? new Date(createInvoiceDto.due_date) : undefined,
        is_ra_bill: createInvoiceDto.is_ra_bill || false,
        customer_id: String(customer.customer_id),
        project_id: project?.project_id ? String(project.project_id) : undefined,
        amount_in_words: amountInWords,
        currency_code: createInvoiceDto.currency_code || 'INR',
        notes_terms_conditions: createInvoiceDto.notes_terms_conditions,
        status: createInvoiceDto.status || 'draft',
        payment_status: createInvoiceDto.payment_status || 'unpaid',
        sgst_rate: sgstRate,
        cgst_rate: cgstRate,
        subtotal,
        discount_amount: createInvoiceDto.items.reduce((sum, item) => sum + (item.discount_amount || 0), 0),
        taxable_amount: subtotal,
        sgst_amount: sgstAmount,
        cgst_amount: cgstAmount,
        total_tax_amount: totalTaxAmount,
        total_amount: totalAmount,
        created_by: createInvoiceDto.created_by,
        updated_by: createInvoiceDto.updated_by,
      });
      console.log("invoice ",invoice)

      // Save invoice to DB
      const savedInvoice = await manager.save(invoice);

      // Create the invoice items
      const items = createInvoiceDto.items.map((item, index) => {
        const quantity = item.quantity || 1;
        const unitPrice = item.unit_price || 0;
        const amount = quantity * unitPrice;
        const discountAmount = item.discount_amount || 0;
        const taxableAmount = amount - discountAmount;
        const taxRate = item.tax_rate || 0;
        const taxAmount = (taxableAmount * taxRate) / 100;
        const totalAmount = taxableAmount + taxAmount;

        return manager.create(InvoiceItem, {
          company_id,
          invoice_id: savedInvoice.invoice_id,
          item_code: item.item_code,
          item_name: item.item_name,
          description: item.description,
          hsn_sac: item.hsn_sac,
          unit: item.unit || 'Nos',
          quantity,
          unit_price: unitPrice,
          amount,
          discount_percentage: item.discount_percentage || 0,
          discount_amount: discountAmount,
          taxable_amount: taxableAmount,
          tax_amount: taxAmount,
          total_amount: totalAmount,
        });
      });

      // Save invoice items to DB
      await manager.save(items);

      // Return the complete invoice with relations
      const completeInvoice = await manager.findOne(Invoice, {
        where: { invoice_id: savedInvoice.invoice_id, company_id, is_deleted: false },
        relations: ['customer', 'project', 'items']
      });
      if (!completeInvoice) {
        throw new NotFoundException('Invoice not found after creation');
      }
      return completeInvoice;
    });
  }

  async findAll(
    company_id: string,
    page: number = 1,
    limit: number = 10,
    includeDeleted: boolean = false
  ): Promise<{
    data: Invoice[],
    total: number,
    page: number,
    limit: number
  }> {
    const whereCondition: any = { company_id };

    if (!includeDeleted) {
      whereCondition.is_deleted = false;
    }

    const [data, total] = await this.invoiceRepository.findAndCount({
      where: whereCondition,
      relations: ['customer', 'project', 'items'],
      order: { updated_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(invoice_id: string, company_id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        invoice_id,
        company_id,
        is_deleted: false
      },
      relations: ['customer', 'project', 'items'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(
    invoice_id: string,
    updateInvoiceDto: Partial<UpdateCompleteInvoiceDto>,
    company_id: string
  ): Promise<Invoice> {

    return await this.dataSource.transaction(async manager => {
      const existingInvoice = await manager.findOne(Invoice, {
        where: {
          invoice_id,
          company_id,
          is_deleted: false
        },
        relations: ['customer', 'project', 'items']
      });

      if (!existingInvoice) {
        throw new NotFoundException('Invoice not found');
      }

      if (existingInvoice.status !== 'draft') {
        throw new BadRequestException('Only draft invoices can be updated');
      }

      // Handle customer updates
      if (updateInvoiceDto.customer) {
        if (updateInvoiceDto.customer.customer_id) {
          // Case 1: Updating with existing customer ID
          const existingCustomer = await manager.findOne(Customer, {
            where: { customer_id: updateInvoiceDto.customer.customer_id, company_id }
          });

          if (!existingCustomer) {
            throw new NotFoundException('Customer not found');
          }

          // Update the invoice to use this customer
          await manager.update(Invoice,
            { invoice_id, company_id },
            { customer_id: updateInvoiceDto.customer.customer_id }
          );

          //  ALSO UPDATE THE CUSTOMER'S DETAILS if provided
          const { customer_id, ...customerUpdateFields } = updateInvoiceDto.customer;
          if (Object.keys(customerUpdateFields).length > 0) {
            await manager.update(Customer,
              { customer_id: updateInvoiceDto.customer.customer_id, company_id },
              customerUpdateFields
            );
          }
        } else {

          // Get current invoice's customer
          const currentCustomer = await manager.findOne(Customer, {
            where: { customer_id: existingInvoice.customer_id, company_id }
          });

          if (!currentCustomer) {
            throw new NotFoundException('Current customer not found');
          }

          // Check if GSTIN changed (indicating a different customer)
          const gstinChanged = updateInvoiceDto.customer.customer_gstin &&
            updateInvoiceDto.customer.customer_gstin !== currentCustomer.customer_gstin;

          if (gstinChanged) {
            // GSTIN changed - check if another customer exists with this GSTIN
            const existingCustomerWithGstin = await manager.findOne(Customer, {
              where: {
                customer_gstin: updateInvoiceDto.customer.customer_gstin,
                company_id
              }
            });

            if (existingCustomerWithGstin) {
              // Use existing customer with this GSTIN
              await manager.update(Invoice,
                { invoice_id, company_id },
                { customer_id: existingCustomerWithGstin.customer_id }
              );

              // Update that customer's details
              const { customer_id, ...customerUpdateFields } = updateInvoiceDto.customer;
              if (Object.keys(customerUpdateFields).length > 0) {
                await manager.update(Customer,
                  { customer_id: existingCustomerWithGstin.customer_id, company_id },
                  customerUpdateFields
                );
              }
            } else {
              // Create new customer with new GSTIN
              const { customer_id, ...newCustomerData } = updateInvoiceDto.customer;

              const lastCustomer = await manager.findOne(Customer, {
                where: { company_id },
                order: { created_at: 'DESC' }
              });
              let nextNumber = 1;
              if (lastCustomer && lastCustomer.customer_code) {
                const match = lastCustomer.customer_code.match(/(\d+)/);
                if (match) {
                  nextNumber = parseInt(match[1]) + 1;
                }
              }
              const customerCode = `CUST${String(nextNumber).padStart(4, '0')}`;

              const newCustomer = manager.create(Customer, {
                ...newCustomerData,
                company_id,
                customer_code: customerCode
              });

              const savedCustomer = await manager.save(Customer, newCustomer);

              await manager.update(Invoice,
                { invoice_id, company_id },
                { customer_id: savedCustomer.customer_id }
              );
            }
          } else {
            //  GSTIN didn't change - just update the current customer's details
            const { customer_id, ...customerUpdateFields } = updateInvoiceDto.customer;
            if (Object.keys(customerUpdateFields).length > 0) {
              await manager.update(Customer,
                { customer_id: currentCustomer.customer_id, company_id },
                customerUpdateFields
              );
            }
          }
        }
      }
      // Handle project updates
      if (updateInvoiceDto.project) {
        if (updateInvoiceDto.project.project_id) {
          // Verify existing project
          const existingProject = await manager.findOne(Project, {
            where: { project_id: updateInvoiceDto.project.project_id, company_id }
          });

          if (!existingProject) {
            throw new NotFoundException('Project not found');
          }

          await manager.update(Invoice,
            { invoice_id, company_id },
            { project_id: updateInvoiceDto.project.project_id }
          );
        } else {
          // Get current invoice to get customer_id
          const invoice = await manager.findOne(Invoice, {
            where: { invoice_id, company_id }
          });

          if (!invoice) {
            throw new NotFoundException('Invoice not found');
          }

          // Create new project
          const { project_id, ...newProjectData } = updateInvoiceDto.project;
          const newProject = manager.create(Project, {
            ...newProjectData,
            company_id,
            customer_id: invoice.customer_id
          });

          const savedProject = await manager.save(Project, newProject);

          await manager.update(Invoice,
            { invoice_id, company_id },
            { project_id: savedProject.project_id }
          );
        }
      }

      // Handle items updates
      if (updateInvoiceDto.items && updateInvoiceDto.items.length > 0) {
        // Calculate amounts for each item
        const processedItems = updateInvoiceDto.items.map((item) => {
          const quantity = item.quantity || 1;
          const unitPrice = item.unit_price || 0;
          const amount = quantity * unitPrice;
          const discountAmount = item.discount_amount || 0;
          const taxableAmount = amount - discountAmount;
          const taxRate = item.tax_rate || 0;
          const taxAmount = (taxableAmount * taxRate) / 100;
          const totalAmount = taxableAmount + taxAmount;

          return manager.create(InvoiceItem, {
            company_id,
            invoice_id,
            item_code: item.item_code,
            item_name: item.item_name,
            description: item.description,
            hsn_sac: item.hsn_sac,
            unit: item.unit || 'Nos',
            quantity,
            unit_price: unitPrice,
            amount,
            discount_percentage: item.discount_percentage || 0,
            discount_amount: discountAmount,
            taxable_amount: taxableAmount,
            tax_amount: taxAmount,
            total_amount: totalAmount,
          });
        });

        // Delete old items and create new ones in the same transaction
        await manager.delete(InvoiceItem, { invoice_id, company_id });
        await manager.save(InvoiceItem, processedItems);

        // Recalculate invoice totals
        const subtotal = updateInvoiceDto.items.reduce((sum, item) => {
          const quantity = item.quantity || 1;
          const unitPrice = item.unit_price || 0;
          const discountAmount = item.discount_amount || 0;
          return sum + (quantity * unitPrice) - discountAmount;
        }, 0);

        const sgstRate = updateInvoiceDto.sgst_rate || 0;
        const cgstRate = updateInvoiceDto.cgst_rate || 0;
        const sgstAmount = (subtotal * sgstRate) / 100;
        const cgstAmount = (subtotal * cgstRate) / 100;
        const totalTaxAmount = sgstAmount + cgstAmount;
        const totalAmount = subtotal + totalTaxAmount;

        // Convert amount to words
        const numWords = require('number-to-words');
        const totalAmountInWords = `${numWords.toWords(Math.floor(totalAmount)).replace(/\b\w/g, l => l.toUpperCase())} Only`;

        await manager.update(Invoice,
          { invoice_id, company_id },
          {
            subtotal,
            discount_amount: updateInvoiceDto.items.reduce((sum, item) => sum + (item.discount_amount || 0), 0),
            taxable_amount: subtotal,
            sgst_amount: sgstAmount,
            cgst_amount: cgstAmount,
            total_tax_amount: totalTaxAmount,
            total_amount: totalAmount,
            amount_in_words: totalAmountInWords,
          }
        );
      }

      // Update simple invoice fields
      const updateData: Partial<Invoice> = {};

      if (typeof updateInvoiceDto.reference_number === 'string') {
        updateData.refrence_number = updateInvoiceDto.reference_number;
      }
      if (updateInvoiceDto.invoice_date !== undefined) {
        updateData.invoice_date = updateInvoiceDto.invoice_date;
      }
      if (updateInvoiceDto.bill_for_month !== undefined) {
        updateData.bill_for_month = updateInvoiceDto.bill_for_month ? new Date(updateInvoiceDto.bill_for_month) : undefined;
      }
      if (updateInvoiceDto.bill_period_start !== undefined) {
        updateData.bill_period_start = updateInvoiceDto.bill_period_start ? new Date(updateInvoiceDto.bill_period_start) : undefined;
      }
      if (updateInvoiceDto.bill_period_end !== undefined) {
        updateData.bill_period_end = updateInvoiceDto.bill_period_end ? new Date(updateInvoiceDto.bill_period_end) : undefined;
      }
      if (updateInvoiceDto.due_date !== undefined) {
        updateData.due_date = updateInvoiceDto.due_date ? new Date(updateInvoiceDto.due_date) : undefined;
      }
      if (updateInvoiceDto.status !== undefined) {
        updateData.status = updateInvoiceDto.status;
      }
      if (updateInvoiceDto.payment_status !== undefined) {
        updateData.payment_status = updateInvoiceDto.payment_status;
      }
      if (updateInvoiceDto.notes_terms_conditions !== undefined) {
        updateData.notes_terms_conditions = updateInvoiceDto.notes_terms_conditions;
      }
      if (updateInvoiceDto.sgst_rate !== undefined) {
        updateData.sgst_rate = updateInvoiceDto.sgst_rate;
      }
      if (updateInvoiceDto.cgst_rate !== undefined) {
        updateData.cgst_rate = updateInvoiceDto.cgst_rate;
      }
      if (updateInvoiceDto.currency_code !== undefined) {
        updateData.currency_code = updateInvoiceDto.currency_code;
      }
      if (updateInvoiceDto.is_ra_bill !== undefined) {
        updateData.is_ra_bill = updateInvoiceDto.is_ra_bill;
      }
      if (updateInvoiceDto.updated_by) {
  updateData.updated_by = updateInvoiceDto.updated_by;
}


      // Update invoice fields if there are any changes
      if (Object.keys(updateData).length > 0) {
        await manager.update(Invoice, { invoice_id, company_id }, updateData);
      }

      // Return updated invoice with all relations
      const updatedInvoice = await manager.findOne(Invoice, {
        where: { invoice_id, company_id, is_deleted: false },
        relations: ['customer', 'project', 'items']
      });
      if (!updatedInvoice) {
        throw new NotFoundException('Invoice not found after update');
      }

      return updatedInvoice;
    });
  }

  async remove(invoice_id: string, company_id: string, deleted_by?: string): Promise<void> {
    const invoice = await this.findOne(invoice_id, company_id);
    if (invoice.status !== 'draft') {
      throw new BadRequestException('Only draft invoices can be deleted');
    }

    await this.invoiceRepository.update(
      { invoice_id, company_id },
      {
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: deleted_by || 'system'
      }
    );
  }

  async updateStatus(invoice_id: string, status: string, company_id: string): Promise<Invoice> {
    const invoice = await this.findOne(invoice_id, company_id);
    invoice.status = status;

    await this.invoiceRepository.save(invoice);
    return invoice;
  }

  async getInvoiceForDisplay(invoice_id: string, company_id: string) {
    const invoice = await this.findOne(invoice_id, company_id);

    const bankDetails = await this.companyBankRepository.findOne({
      where: {
        company_id,
        is_active: true,
        is_delete: false
      }
    });

    return {
      document_type: invoice.document_type,
      reference_number: invoice.refrence_number,
      date: invoice.invoice_date,
      due_date: invoice.due_date,
      status: invoice.status,

      customer: {
        name: invoice.customer.customer_name,
        email: invoice.customer.customer_email,
        phone: invoice.customer.customer_phone,
        address: invoice.customer.customer_address,
        city: invoice.customer.city,
        state: invoice.customer.state,
        pincode: invoice.customer.pincode,
        gstin: invoice.customer.customer_gstin,
      },

      work_order: {
        name: invoice.project?.project_name || 'N/A',
        project_name: invoice.project?.project_name || 'N/A',
        work_details: invoice.project?.work_details_scope || 'N/A'
      },

      items: invoice.items.map((item, index) => ({
        sl: index + 1,
        item_code: item.item_code,
        description: item.description,
        hsn_sac: item.hsn_sac,
        unit: item.unit,
        rate: parseFloat(item.unit_price.toString()),
        qty: item.quantity,
        amount: parseFloat(item.total_amount.toString())
      })),

      financial_summary: {
        subtotal: parseFloat(invoice.subtotal.toString()),
        sgst_rate: parseFloat(invoice.sgst_rate.toString()),
        cgst_rate: parseFloat(invoice.cgst_rate.toString()),
        sgst_amount: parseFloat(invoice.sgst_amount.toString()),
        cgst_amount: parseFloat(invoice.cgst_amount.toString()),
        total_amount: parseFloat(invoice.total_amount.toString()),
        amount_in_words: invoice.amount_in_words
      },

      bank_details: bankDetails ? {
        bank_name: bankDetails.bank_name,
        account_name: 'DHPE',
        account_number: bankDetails.account_number,
        ifsc: bankDetails.ifsc_code,
        branch: bankDetails.branch_name
      } : null,

      notes_terms_conditions: invoice.notes_terms_conditions
    };
  }
}
