import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
} from 'typeorm';
import { IsUUID, IsOptional, Length, IsBoolean } from 'class-validator';

@Entity('company_types')
export class CompanyType {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  company_type_id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Length(2, 100)
  type_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  description?: string;

  @Column({ type: 'char', length: 36, nullable: false })
  @IsUUID()
  created_by: string;

  @Column({ type: 'char', length: 36, nullable: false })
  @IsUUID()
  updated_by: string;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  is_deleted: boolean;

@CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  updated_at: Date;
}
