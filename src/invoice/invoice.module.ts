// src/modules/invoice.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Customer } from './entities/customer.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Project } from './entities/project.entity';
import { CompanyBankEntity } from '../company/entities/company-bank-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem, Customer,Project,CompanyBankEntity])
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService]
})
export class InvoiceModule {}
