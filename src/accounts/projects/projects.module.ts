// projects.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
// import { Project } from '../../invoice/entities/project.entity'; // Adjust path as needed
import { ProjectIncomeCategory } from './entities/project.income.categories.entity';
import { ProjectExpenseCategory } from './entities/project.expenses.categories.entity';
import { ProjectActualEntry } from './entities/project.actual.entry.entity';
import { ProjectPaymentLogs } from './entities/project.payment.logs.entity';
import { Project } from '../../invoice/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectIncomeCategory,
      ProjectExpenseCategory,
      ProjectActualEntry,
      ProjectPaymentLogs,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService, TypeOrmModule], 
})
export class ProjectsModule {}
