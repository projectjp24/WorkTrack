import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { VendorEntity } from '../../vendor-management/entities/vendor.entity';
import { PurchaseOrderItemEntity } from './purchase_order_item.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('purchase_order')
export class PurchaseOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  purchase_order_id: string;

  @Column({ nullable: true })
  company_id: string;

  @ManyToOne(() => Company, (company) => company.purchaseOrders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ nullable: true })
  vendor_id: string;

  @Column({ nullable: true })
  purchase_order_number: string;

  @Column({ nullable: true })
  order_date: Date;

  @Column({ nullable: true })
  expected_delivery: Date;

  @Column({ nullable: true })
  shipping_address?: string;

  @Column({ nullable: true })
  billing_address: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  sub_total: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  sgst: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  cgst: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  sgst_amount: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  cgst_amount: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  total_tax_amount: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  total_amount: number;

  @Column({ type: 'text', nullable: true })
  total_amount_in_words: string;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;

  // vendor_id will be handled automatically by relation
  @ManyToOne(() => VendorEntity, (vendor) => vendor.purchase_orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorEntity;

  // Relation with PurchaseOrderItemEntity
  @OneToMany(() => PurchaseOrderItemEntity, (item) => item.purchase_order)
  items: PurchaseOrderItemEntity[];
}
