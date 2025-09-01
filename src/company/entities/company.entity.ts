import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsEmail, IsUrl, IsOptional, Length, IsBoolean, IsUUID } from 'class-validator';
import { CompanyType } from './company-type.entity';
import { CompanyBranch } from './company-branch.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  company_id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Length(2, 50)
  company_name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  @Length(5, 50)
  registration_no: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  @Length(15, 20)
  @IsOptional()
  gst_number?: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  @Length(10, 20)
  @IsOptional()
  pan_number?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @Column({ type: 'uuid', nullable: false })
  @IsUUID()
  created_by: string;

  @Column({ type: 'uuid', nullable: false })
  @IsUUID()
  updated_by: string;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  is_deleted: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsEmail()
  @IsOptional()
  company_email?: string;

  @Column({ type: 'uuid', nullable: true })
  @IsUUID()
  @IsOptional()
  company_type_id?: string;

  // Relation to CompanyType
  @ManyToOne(() => CompanyType)
  @JoinColumn({ name: 'company_type_id' })
  company_type?: CompanyType;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Length(10, 20)
  @IsOptional()
  company_phone?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  company_address?: string;

  @Column({ type: 'varchar', length: 50, default: 'active', nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsUrl()
  @IsOptional()
  company_website_url?: string;

  // Relation to CompanyBranch
  @OneToMany(() => CompanyBranch, (branch) => branch.company)
  branches?: CompanyBranch[];

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
    roles: any;
    rolePermissions: any;
    permissions: any;
    departments: any;
}
