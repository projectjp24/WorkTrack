import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { Project } from "./project.entity";
import { InvoiceItem } from "./invoice-item.entity";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  invoice_id: string;

  @Column({ type: 'uuid' })
  company_id: string;

  @Column({ type: 'enum', enum: ['Tax Invoice', 'Cash memo', 'Bill of Supply'], default: 'Tax Invoice' })
  document_type: string;

  @Column({ length: 100, nullable: true })
  refrence_number: string;

  @Column({ type: 'date' })
  invoice_date: string;

  @Column({ type: 'date', nullable: true })
  bill_for_month?: Date;

  @Column({ type: 'date', nullable: true })
  bill_period_start?: Date;

  @Column({ type: 'date', nullable: true })
  bill_period_end?: Date;

  @Column({ type: 'date', nullable: true })
  due_date?: Date;

  @Column({ default: false })
  is_ra_bill: boolean;

  @Column('uuid')
  customer_id: string;

  @Column('uuid', { nullable: true })
  project_id?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxable_amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  sgst_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cgst_rate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  sgst_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cgst_amount: number;

  @Column({ type: 'text', nullable: true })
  amount_in_words?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_tax_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_amount: number;

  @Column({
    type: 'enum',
    enum: ['draft', 'sent', 'acknowledged', 'approved', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  })
  status: string;

  @Column({ type: 'uuid', nullable: true })
  bank_detail_id?: string;

  @Column({
    type: 'enum',
    enum: ['unpaid', 'partial', 'paid', 'overdue'],
    default: 'unpaid'
  })
  payment_status: string;

  @Column({ length: 3, default: 'INR' })
  currency_code: string;

  @Column({ type: 'text', nullable: true })
  notes_terms_conditions?: string;

  @CreateDateColumn()
  created_at: Date;


  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  created_by?: string;

  @Column({ nullable: true })
  updated_by?: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @Column({ nullable: true })
  deleted_by?: string;

  // Relations
  @ManyToOne(() => Customer, customer => customer.invoices)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Project, project => project.invoices, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

 @OneToMany(() => InvoiceItem, item => item.invoice, { cascade: false, eager: false })
items: InvoiceItem[];
}
