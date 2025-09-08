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
import { UserEntity as User } from "./user.entity";

@Entity("roles")
export class RoleEntity {
  static role_name(role_name: any): boolean {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn("uuid")
  role_id: string;

  @Column()
  role_name: string;

  @Column()
  description: string;

  // ---------- RELATIONS ----------

  // Many roles belong to one company
  @ManyToOne(() => Company, (company) => company.roles, { onDelete: "SET NULL" })
  @JoinColumn({ name: "company_id" })
  company: Company;

  // One role can have many users
  @OneToMany(() => User, (user: User) => user.role)
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
    rolePermissions: any;
  name: any;
}
