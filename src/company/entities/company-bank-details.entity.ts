import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Company } from "./company.entity"; // Adjust path if needed
import { IsUUID } from "class-validator";
import { UserEntity } from "src/user-management/entities/user.entity";

@Entity('company_bank_details')
export class CompanyBankEntity {
    @PrimaryGeneratedColumn('uuid')
    bank_detail_id: string;

    @Column()
    bank_name: string;

    @Column()
    account_number: string;

    @Column()
    ifsc_code: string;

    @Column()
    branch_name: string;

    @Column()
    account_type: string;

    @Column()
    company_id: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: false })
    is_delete: boolean;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true })
    updatedBy: string;

   // Relation to Company
    @ManyToOne(() => Company, company => company.bankAccounts, { onDelete: 'CASCADE' },)
    @JoinColumn({ name: 'company_id', })
    company: Company;

    // Relation to UserEntity for createdBy
    // @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
    // @JoinColumn({ name: 'createdBy' })
    // createdByUser: UserEntity;

    // Relation to UserEntity for updatedBy
    // @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
    // @JoinColumn({ name: 'updatedBy' })
    // updatedByUser: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
