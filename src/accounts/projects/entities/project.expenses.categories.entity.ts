import { Project } from "src/invoice/entities/project.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";




@Entity('project_expense_categories')
export class ProjectExpenseCategory {

    @PrimaryGeneratedColumn('uuid')
    expenses_id: string

    @Column({ type: "uuid", nullable: true })
    company_id: string

    @Column()
    expenses_category_name: string


    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    budgeted_amount: number;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => Project, project => project.expenseCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

}