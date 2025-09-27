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
import { PurchaseOrderEntity } from '../../purchase_order/entities/purchase_order.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('vendors')
export class VendorEntity {
  @PrimaryGeneratedColumn('uuid')
  vendor_id: string;

  @Column({ unique: true, nullable: true })
  vendor_detail_id: string;

  @Column({ nullable: true })
  company_id: string;

  @ManyToOne(() => Company, (company) => company.vendors, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "company_id" })
  company: Company;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  contact_person: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  state_code: number;

  @Column({ nullable: true })
  gstin: string;

  @Column({ nullable: true })
  pan: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  account_number: string;

  @Column({ nullable: true })
  ifsc_code: string;

  @Column({ nullable: true })
  branch: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_delete: boolean;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;

  //Relation with Purchase Orders
  @OneToMany(() => PurchaseOrderEntity, (po) => po.vendor)
  purchase_orders: PurchaseOrderEntity[];
}
