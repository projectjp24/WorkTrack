import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, Req, Request } from "@nestjs/common";
import { InvoiceService } from "./invoice.service";
import { CreateCompleteInvoiceDto, UpdateCompleteInvoiceDto } from "./dto/create-invoice.dto";
import { Invoice } from "./entities/invoice.entity";

@Controller('companies/:company_id/invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  async createInvoice(
    @Param('company_id') company_id: string,
    @Body() createInvoiceDto: CreateCompleteInvoiceDto,
    @Request() req: any,
  ): Promise<{
    success: boolean;
    message: string;
    data: Invoice;
    statusCode: number;
  }> {
    if (!company_id) {
      throw new BadRequestException('company_id parameter is required');
    }

    const invoice = await this.invoiceService.createInvoice(createInvoiceDto, company_id);

    return {
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
      statusCode: HttpStatus.CREATED,
    };
  }


  @Get()
  async findAll(
    @Param('company_id') company_id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    success: boolean;
    data: { data: Invoice[]; total: number; page: number; limit: number };
    statusCode: number;
  }> {
    if (!company_id) {
      throw new BadRequestException('company_id parameter is required');
    }

    const result = await this.invoiceService.findAll(company_id, page, limit);

    return {
      success: true,
      data: result,
      statusCode: HttpStatus.OK,
    };
  }


  @Get(':invoice_id')
  async findOne(
    @Param('company_id') company_id: string,
    @Param('invoice_id') invoice_id: string
  ): Promise<{
    success: boolean;
    data: Invoice;
    statusCode: number;
  }> {
    if (!company_id) {
      throw new BadRequestException('company_id parameter is required');
    }

    const invoice = await this.invoiceService.findOne(invoice_id, company_id);

    return {
      success: true,
      data: invoice,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':invoice_id/display')
  async getInvoiceForDisplay(
    @Param('company_id') company_id: string,
    @Param('invoice_id') invoice_id: string
  ): Promise<{
    success: boolean;
    data: any;
    statusCode: number;
  }> {
    const result = await this.invoiceService.getInvoiceForDisplay(invoice_id, company_id);

    return {
      success: true,
      data: result,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':invoice_id')
  async updateInvoice(
    @Param('company_id') company_id: string,
    @Param('invoice_id') invoice_id: string,
    @Body() updateInvoiceDto: UpdateCompleteInvoiceDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: Invoice;
    statusCode: number;
  }> {
    const invoice = await this.invoiceService.update(invoice_id, updateInvoiceDto, company_id);

    return {
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':invoice_id')
  async removeInvoice(
    @Param('company_id') company_id: string,
    @Param('invoice_id') invoice_id: string,
  ): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
  }> {
    await this.invoiceService.remove(invoice_id, company_id);

    return {
      success: true,
      message: 'Invoice deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }

}
