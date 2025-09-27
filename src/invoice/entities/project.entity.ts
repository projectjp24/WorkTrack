import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { Invoice } from "./invoice.entity";



@Entity("project")
export class Project {
  @PrimaryGeneratedColumn('uuid')
  project_id: string;

  @Column({ length: 200 })
  project_name: string;

  @Column({ length: 200 }) @Column({ type: 'text', nullable: true })
  work_details_scope?: string;
  @Column('uuid')
  company_id: string;

  @Column('uuid')
  customer_id: string;

  @Column({ type: "enum", enum: ['active', 'inactive', 'cancelled', 'on_hold'], default: 'active' })
  project_status: string;

  @Column({ type: 'date', nullable: true })
  start_date?: string;
  @Column({ type: 'date', nullable: true })
  end_date?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  project_value?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  created_by?: string;

  @Column({ nullable: true })
  updated_by?: string;

  // Relations
  @ManyToOne(() => Customer, customer => customer.projects)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => Invoice, invoice => invoice.project)
  invoices: Invoice[];


}