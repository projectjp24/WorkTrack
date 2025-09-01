import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyType } from './entities/company-type.entity';
import { CompanyBranch } from './entities/company-branch.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}