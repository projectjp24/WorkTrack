import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Company } from "./company.entity"; // Adjust path if needed

@Entity('company_bank_details')
export class CompanyBankEntity {
    @PrimaryGeneratedColumn('uuid')
    bank_detail_id: string;

    @Column()
    bank_name: string;

    @Column({length: 36})
    account_number: string;

    @Column()
    ifsc_code: string;

    @Column()
    branch_name: string;

    @Column()
    account_type: string;

    @Column()
    company_id: string;

    @ManyToOne(() => Company, company => company.bankAccounts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
