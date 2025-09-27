import { Project } from "../../../invoice/entities/project.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('project_income_categories')
export class ProjectIncomeCategory {
    @PrimaryGeneratedColumn('uuid')
    income_id: string

    @Column({ type: "uuid", nullable: true })
    company_id: string

    @Column({ nullable: true })
    income_category_name: string

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    budgeted_amount: number

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Project, project => project.incomeCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

}