import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Company } from "../../company/entities/company.entity";
import { userEntity as User } from "./user.entity";

@Entity("departments")
export class DepartmentEntity {
  @PrimaryGeneratedColumn("uuid")
  department_id: string;

  @Column()
  department_name: string;

  // ---------- RELATIONS ----------

  // Many departments belong to one company
  @ManyToOne(() => Company, (company) => company.departments, { onDelete: "SET NULL" })
  @JoinColumn({ name: "company_id" })
  company: Company;

  // One department can have many users
  @OneToMany(() => User, (user) => user.department)
  users: User[];

  // ---------- STATUS FIELDS ----------
  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
