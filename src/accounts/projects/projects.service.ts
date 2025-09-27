import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectDto } from '../../invoice/dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../invoice/entities/project.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProjectIncomeCategory } from './entities/project.income.categories.entity';
import { ProjectExpenseCategory } from './entities/project.expenses.categories.entity';
import { ProjectPaymentLogs } from './entities/project.payment.logs.entity';
import { ProjectActualEntry } from './entities/project.actual.entry.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectIncomeCategory)
    private readonly incomeCategoryRepository:Repository<ProjectIncomeCategory>,
    @InjectRepository(ProjectExpenseCategory)
    private readonly expenseCategoryRepository:Repository<ProjectExpenseCategory>,
      @InjectRepository(ProjectActualEntry)
     private readonly actualEntryRepository: Repository<ProjectActualEntry>,
    @InjectRepository(ProjectPaymentLogs)
    private readonly paymentLogRepository: Repository<ProjectPaymentLogs>,
    private readonly dataSource: DataSource,

  ) { }
  create(createProjectDto: ProjectDto,user_id:string,company_id:string) {
    return this.dataSource.transaction(async (manager)=>{
      try{
        const projectCode = await this.generateProjectCode(company_id, manager)

         const project = manager.create(Project, {
          ...createProjectDto,
          project_code: projectCode,
          company_id: company_id,
          created_by: user_id,
        });

        const savedProject= await manager.save(project)
        if (createProjectDto.incomeCategories?.length) {
          const incomeCategories = createProjectDto.incomeCategories.map(category =>
            manager.create(ProjectIncomeCategory, {
              name: category.income_category_name,
              budgeted_amount: category.budgeted_amount,
              project_id: savedProject.project_id,
              company_id: company_id,
            })
          );
          await manager.save(ProjectIncomeCategory, incomeCategories);
        }

             if (createProjectDto.expenseCategories?.length) {
          const expenseCategories = createProjectDto.expenseCategories.map(category =>
            manager.create(ProjectExpenseCategory, {
              name: category.expense_category_name,
              budgeted_amount: category.budgeted_amount,
              project_id: savedProject.project_id,
              company_id: company_id,
            })
          );
          await manager.save(ProjectExpenseCategory, expenseCategories);
        }
           return await this.getProjectWithDetails(savedProject.project_id, company_id, manager);
   } catch (error) {
        throw new BadRequestException(`Failed to create project: ${error.message}`);
      }
    });
  }

  async findAllByCompany(companyId: string) {
    return await this.projectRepository.find({
      where: { company_id: companyId },
      relations: ['customer'],
      select: {
        project_id: true,
        project_code: true,
        project_name: true,
        project_status: true,
        start_date: true,
        end_date: true,
        project_value: true,
        created_at: true,
        customer: {
          customer_id: true,
          customer_name: true,
        }
      },
      order: { created_at: 'DESC' },
    });
  }
    async findOneWithFinancials(project_id: string, company_id: string) {
    return await this.dataSource.transaction('READ COMMITTED', async (manager: EntityManager) => {
      return await this.getProjectWithDetails(project_id, company_id, manager);
    });
  }

 async update(project_id: string, updateProjectDto: UpdateProjectDto, user_id: string, company_id: string) {

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      // Verify project exists and belongs to company
      const existingProject = await manager.findOne(Project, {
        where: { project_id: project_id, company_id: company_id },
      });

      if (!existingProject) {
        throw new NotFoundException('Project not found or access denied');
      }

      // Update project
      await manager.update(Project, 
        { project_id: project_id, company_id: project_id },
        { ...updateProjectDto, updated_by: user_id }
      );

      return await this.getProjectWithDetails(project_id, company_id, manager);
    });
  }


  async remove(projectId: string, companyId: string) {
  
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const project = await manager.findOne(Project, {
        where: { project_id: projectId, company_id: companyId },
      });

      if (!project) {
        throw new NotFoundException('Project not found or access denied');
      }

      // Delete in correct order (children first to avoid FK constraints)
      await manager.delete(ProjectActualEntry, { project_id: projectId, company_id: companyId });
      await manager.delete(ProjectPaymentLogs, { project_id: projectId, company_id: companyId });
      await manager.delete(ProjectIncomeCategory, { project_id: projectId, company_id: companyId });
      await manager.delete(ProjectExpenseCategory, { project_id: projectId, company_id: companyId });
      await manager.remove(Project, project);

      return { 
        message: 'Project and all related data deleted successfully',
        deletedProjectId: projectId 
      };
    });
  }


    private async getProjectWithDetails(
    project_id: string, 
    company_id: string, 
    manager: EntityManager
  ) {
    const project = await manager.findOne(Project, {
      where: { project_id: project_id, company_id: company_id },
      relations: ['customer'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Get all related data in parallel
    const [incomeCategories, expenseCategories, actualEntries, paymentLogs] = await Promise.all([
      manager.find(ProjectIncomeCategory, {
        where: { project: { project_id: project_id }, company_id: company_id },
        order: { created_at: 'ASC' },
      }),
      manager.find(ProjectExpenseCategory, {
        where: { project: { project_id: project_id }, company_id: company_id },
        order: { created_at: 'ASC' },
      }),
      manager.find(ProjectActualEntry, {
        where: { project: { project_id: project_id }, company_id: company_id },
        order: { date: 'DESC', created_at: 'DESC' },
      }),
      manager.find(ProjectPaymentLogs, {
        where: { project: { project_id: project_id }, company_id: company_id },
        order: { date: 'DESC', created_at: 'DESC' },
      }),
    ]);
}
  private async generateProjectCode(companyId: string, manager: EntityManager): Promise<string> {
    const currentYear = new Date().getFullYear();
    const count = await manager.count(Project, {
      where: { company_id: companyId },
    });
    return `PROJ-${currentYear}-${String(count + 1).padStart(4, '0')}`;
  }

   private calculateFinancialSummary(
    incomeCategories: ProjectIncomeCategory[],
    expenseCategories: ProjectExpenseCategory[],
    actualEntries: ProjectActualEntry[],
    paymentLogs: ProjectPaymentLogs[]
  ) {
    const totalBudgetedIncome = incomeCategories.reduce((sum, cat) => sum + Number(cat.budgeted_amount), 0);
    const totalBudgetedExpenses = expenseCategories.reduce((sum, cat) => sum + Number(cat.budgeted_amount), 0);
    const actualIncome = actualEntries.filter(e => e.type === 'Income').reduce((sum, e) => sum + Number(e.amount), 0);
    const actualExpenses = actualEntries.filter(e => e.type === 'Expense').reduce((sum, e) => sum + Number(e.amount), 0);
    const totalInflow = paymentLogs.filter(p => p.type === 'Inflow').reduce((sum, p) => sum + Number(p.amount), 0);
    const totalOutflow = paymentLogs.filter(p => p.type === 'Outflow').reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      total_budgeted_income: totalBudgetedIncome,
      total_budgeted_expenses: totalBudgetedExpenses,
      net_budgeted_profit_loss: totalBudgetedIncome - totalBudgetedExpenses,
      actual_income: actualIncome,
      actual_expenses: actualExpenses,
      actual_net_profit_loss: actualIncome - actualExpenses,
      budget_vs_actual_variance: (totalBudgetedIncome - totalBudgetedExpenses) - (actualIncome - actualExpenses),
      total_inflow: totalInflow,
      total_outflow: totalOutflow,
      net_cash_flow: totalInflow - totalOutflow,
    };
  }

  
}
