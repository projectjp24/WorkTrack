import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseOrderEntity } from './purchase_order.entity';

@Entity('purchase_order_item')
export class PurchaseOrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  purchase_order_item_id: string;

  @Column({ nullable: true })
  company_id: string;

  @Column({ nullable: true })
  purchase_order_id: string;

  // purchase_order_id will be handled automatically by relation
  @ManyToOne(() => PurchaseOrderEntity, (po) => po.items, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'purchase_order_id' })
  purchase_order: PurchaseOrderEntity;

  @Column({ nullable: true })
  item_name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  hsn_sac: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  quantity: number;

  @Column({ nullable: true })
  unit: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  unit_price: number;

  @Column({
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) =>
        value !== null ? parseFloat(value) : null,
    },
  })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
