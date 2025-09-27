import { Company } from 'src/company/entities/company.entity';
import { CompanyBranch } from 'src/company/entities/company-branch.entity';
import { DepartmentEntity } from 'src/user-management/entities/department.entity';
import { RoleEntity } from 'src/user-management/entities/roles.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ unique: true })
  employee_id: string;

  // ---------- RELATIONS ----------

  // Many users belong to one company
  @ManyToOne(() => Company, (company) => company.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // Many users belong to one branch (optional)
  @ManyToOne(() => CompanyBranch, (branch) => branch.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'branch_id' })
  branch: CompanyBranch;

  // Many users belong to one department
  @ManyToOne(() => DepartmentEntity, (dept) => dept.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  // Many users have one role
  @ManyToOne(() => RoleEntity, (role) => role.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  // ---------- USER FIELDS ----------
  @Column({ nullable: true })
  company_id: string;

  @Column({ nullable: true })
  branch_id?: string | null;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column({ select: false })
  phone_number: string;

  @Column()
  date_of_birth: string;

  @Column({ nullable: true })
  department_id: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  role_id: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
