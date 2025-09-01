import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsUUID, IsOptional, Length, IsBoolean, IsEmail } from 'class-validator';
import { Company } from './company.entity';
import { CompanyType } from './company-type.entity';

@Entity('company_branches')
export class CompanyBranch {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  branch_id: string;

  // Relation to Company
  @Column({ type: 'uuid', nullable: false })
  @IsUUID()
  company_id: string;

  @ManyToOne(() => Company, (company) => company.branches)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // Optional relation to CompanyType (inherited from company)
  @Column({ type: 'uuid', nullable: true })
  @IsUUID()
  @IsOptional()
  company_type_id?: string;

  @ManyToOne(() => CompanyType)
  @JoinColumn({ name: 'company_type_id' })
  company_type?: CompanyType;

  // Branch-specific fields
  @Column({ type: 'varchar', length: 100, nullable: false })
  @Length(2, 100)
  branch_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  branch_address: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  branch_contact: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  branch_manager_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsEmail()
  branch_email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  branch_phone?: string;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  is_deleted: boolean;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes?: string;

@CreateDateColumn({
  type: 'timestamp',
  precision: 0, 
  default: () => 'CURRENT_TIMESTAMP',
})
created_at: Date;

@UpdateDateColumn({
  type: 'timestamp',
  precision: 0, 
  default: () => 'CURRENT_TIMESTAMP',
  onUpdate: 'CURRENT_TIMESTAMP',
})
updated_at: Date;
    users: any;
}
