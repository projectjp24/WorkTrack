import { Company } from "src/company/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('vendor_work_orders')
export class VendorWorkOrder {
    @PrimaryGeneratedColumn('uuid')
    vendor_work_order_id: string;

    @Column({ nullable: true })
    work_order_id: string;

    @Column({ nullable: true })
    company_id: string;

    @ManyToOne(() => Company, (company) => company.purchaseOrders, {
        onDelete: 'SET NULL',
      })
      @JoinColumn({ name: 'company_id' })
      company: Company;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    scope_of_work: string;

    @Column({ nullable: true })
    vendor_id: string;

    @Column({ nullable: true })
    assigned_date: Date;
    
    @Column({ nullable: true })
    start_date: Date;

    @Column({ nullable: true })
    end_date: Date;

    @Column({ nullable: true })
    budget: number;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    created_by: string;

    @Column({ nullable: true })
    updated_by: string;

    @Column({ nullable: true })
    is_deleted: boolean;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;


    deliverables: any;
}
