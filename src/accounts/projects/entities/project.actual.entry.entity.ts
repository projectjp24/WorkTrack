import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProjectExpenseCategory } from "./project.expenses.categories.entity";
import { ProjectIncomeCategory } from "./project.income.categories.entity";
import { Project } from "../../../invoice/entities/project.entity";



@Entity('project_actual_entry')
export class ProjectActualEntry {
    @PrimaryGeneratedColumn("uuid")
    actual_entry_id: string

    @Column({ type: "uuid", nullable: true })
    company_id: string

    @Column({
        type: 'enum',
        enum: ['Income', 'Expense']
    })
    type: 'Income' | 'Expense';

    @Column({ type: 'date' })
    date: Date

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ nullable: true })
    linked_doc_id: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column('uuid')
    createdBy: string;

    @Column('uuid', { nullable: true })
    income_id: string;

    @Column('uuid', { nullable: true })
    expenses_id: string;

    @ManyToOne(() => ProjectIncomeCategory, { nullable: true })
    @JoinColumn({ name: 'income_id' })
    incomeCategory: ProjectIncomeCategory;

    @ManyToOne(() => ProjectExpenseCategory, { nullable: true })
    @JoinColumn({ name: 'expenses_id' })
    expenseCategory: ProjectExpenseCategory;

     @ManyToOne(() => Project, project => project.actualEntries)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}