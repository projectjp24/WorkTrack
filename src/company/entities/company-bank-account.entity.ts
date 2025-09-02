import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Timestamp,
} from 'typeorm';
import { Company } from './company.entity';
 // assuming you already have Company entity

@Entity('company_bankAccount')
export class CompanyBankAccount {
  @PrimaryGeneratedColumn('uuid')
  account_id: number;

 @Column({ type: 'uuid' })
  company_id: string;

  @ManyToOne(() => Company, (company) => company.bankAccounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ length: 100 })
  bank_name: string;

  @Column({ length: 50 })
  account_number: string;

  @Column({ length: 20 })
  ifsc_code: string;

  @Column({ length: 100 })
  branch_name: string;

  @Column({ length: 20 })
  account_type: string;

 @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  

}