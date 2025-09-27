import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Invoice } from "./invoice.entity";

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  item_id: string;

  @Column({ type: 'uuid' , nullable: true })
  invoice_id: string;

  @Column('uuid')
  company_id: string;   // <-- Add this for tenant isolation

  @Column({ length: 50, nullable: true })
  item_code?: string;

  @Column({ length: 255, nullable: true })
  item_name?: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 8, nullable: true })
  hsn_sac?: string;

  @Column({ length: 20, default: 'Nos' , nullable: true})
  unit: string;

  @Column({ type: 'decimal', precision: 12, scale: 3 , nullable: true})
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 , nullable: true})
  unit_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 , nullable: true})
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 , nullable: true})
  discount_percentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 , nullable: true})
  discount_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 , nullable: true})
  taxable_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, nullable: true })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 , nullable: true})
  total_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Invoice, invoice => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
}
