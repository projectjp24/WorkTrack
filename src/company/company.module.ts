import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyType } from './entities/company-type.entity';
import { CompanyBranch } from './entities/company-branch.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyBankEntity } from './entities/company-bank-details.entity';
import { CompanyBankDetailsService } from './company_bank_details/company_bank_details.service';
import { CompanyBankDetailController } from './company_bank_details/company_bank_details.controller';
import { BranchManagementService } from './company_branch_management/branch_management.service';
import { BranchManagementController } from './company_branch_management/branch_management.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanyType, CompanyBranch, CompanyBankEntity]),
  ],
  providers: [CompanyService, CompanyBankDetailsService, BranchManagementService],
  controllers: [CompanyController, CompanyBankDetailController, BranchManagementController],
})
export class CompanyModule {}