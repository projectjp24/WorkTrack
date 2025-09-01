import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {
  IsUUID,
  IsOptional,
  Length,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { Company } from './company.entity';
import { CompanyType } from './company-type.entity';


@Entity('company_branches')
export class CompanyBranch {
  @PrimaryGeneratedColumn('uuid')
  branch_id: string;

  // Relation to Company
  @Column({ type: 'uuid' })
  company_id: string;

  @ManyToOne(() => Company, (company) => company.branches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // Optional relation to CompanyType
  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  company_type_id?: string;

  @ManyToOne(() => CompanyType, { nullable: true })
  @JoinColumn({ name: 'company_type_id' })
  company_type?: CompanyType;

  // Branch details
  @Column({ type: 'varchar', length: 100 })
  @Length(2, 100)
  branch_name: string;

  @Column({ type: 'varchar', length: 255 })
  branch_address: string;

  @Column({ type: 'varchar', length: 100 })
  branch_contact: string; // maybe rename to `branch_contact_person`

  @Column({ type: 'varchar', length: 100 })
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

  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updated_at: Date;

  // Relation: Users under this branch

}
