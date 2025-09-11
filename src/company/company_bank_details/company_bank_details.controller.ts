import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CompanyBankDetailsService } from './company_bank_details.service';
import { CreateBankDto } from '../dto/create-bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';

@Controller('company/bank')
export class CompanyBankDetailController {
  constructor(private readonly bankService: CompanyBankDetailsService) {}

  @Post('addBank/:company_id')
  async addBank(
    @Param('company_id', ParseUUIDPipe) company_id: string,
    @Body() createBankDto: CreateBankDto,
  ) {
    const result = await this.bankService.addBank(createBankDto, company_id);
    return { message: 'Bank added successfully', data: result };
  }

  @Get('allBank/:company_id')
  async allBank(@Param('company_id', ParseUUIDPipe) company_id: string) {
    const bank = await this.bankService.findAll(company_id);
    return bank;
  }

  @Get('/:bank_id/:company_id')
  async find(
    @Param('bank_id', ParseUUIDPipe) bank_id: string,
    @Param('company_id', ParseUUIDPipe) company_id: string,
  ) {
    const bank = await this.bankService.findBank(company_id, bank_id);
    return bank;
  }

  @Patch('updateBank/:bank_id/:company_id')
  async update(
    @Param('bank_id', ParseUUIDPipe) bank_id: string,
    @Param('company_id', ParseUUIDPipe) company_id: string,
    @Body() updateBank: UpdateBankDto,
  ) {
    const updatedBank = await this.bankService.update(
      bank_id,
      company_id,
      updateBank,
    );
    return { message: 'Bank Details Updated Successfully' };
  }

  @Delete('delete/:bank_id/:company_id')
  async remove(@Param('bank_id') bank_id: string, @Param('company_id') company_id: string){
    return await this.bankService.softDelete(bank_id, company_id)
  }
}
