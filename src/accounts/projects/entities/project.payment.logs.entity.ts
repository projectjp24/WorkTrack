import { Project } from "src/invoice/entities/project.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity('project_payments_logs')
export class ProjectPaymentLogs {

    @PrimaryGeneratedColumn("uuid")
    payment_logs_id: string

    @Column({ type: 'uuid', nullable: true })
    company_id: string

    @Column({
        type: 'enum',
        enum: ['Inflow', 'Outflow']
    })
    type: 'Inflow' | 'Outflow';

    @Column({ type: 'date' })
    date: Date

    @Column({ type: "text", nullable: true })
    description: string

    @Column({ nullable: true })
    linked_doc_id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    amount: number;


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


    @Column('uuid')
    project_id: string;

    @Column('uuid')
    createdBy: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;




}