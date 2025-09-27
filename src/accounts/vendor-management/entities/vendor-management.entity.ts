// import { Company } from "src/company/entities/company.entity";
// import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

// @Entity('vendors')
// export class VendorManagementEntity {
//     @PrimaryGeneratedColumn('uuid')
//     vendor_detail_id: string;
    
//     @Column()
//     vendor_id: string;

//     @Column({ nullable: true })
//     company_id: string;

//     @ManyToOne(() => Company, (company) => company.vendors, { onDelete: 'SET NULL' })
//     @JoinColumn({ name: "company_id" })
//     company: Company;

//     @Column({ nullable: true })
//     vendor_name: string;

//     @Column({ nullable: true })
//     vendor_email: string;

//     @Column({ nullable: true })
//     vendor_phone: string;

//     @Column({ nullable: true })
//     vendor_address: string;

//     @Column({ nullable: true })
//     vendor_city: string;

//     @Column({ nullable: true })
//     vendor_pan: string;

//     @Column({ nullable: true })
//     vendor_gstin: string;

//     @Column({ nullable: true, default: true })
//     is_active: boolean;

//     @Column({ nullable: true, default: false })
//     is_deleted: boolean;

//     @CreateDateColumn()
//     created_at: Timestamp;

//     @UpdateDateColumn()
//     updated_at: Timestamp;
// }
