// project-financial-summary.entity.ts

import { Project } from "src/invoice/entities/project.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";


@Entity('project_financial_summaries')
export class ProjectFinancialSummary {
  @PrimaryColumn('uuid')
  finacial_id: string;

  @Column('uuid') // ADDED COMPANY ID
  companyId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalBudgetedIncome: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalBudgetedExpenses: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netBudgetedProfitLoss: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualIncome: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualExpenses: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualNetProfitLoss: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  budgetVsActualVariance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalInflow: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalOutflow: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netCashFlow: number;

  @UpdateDateColumn()
  lastCalculated: Date;

  @OneToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

}
