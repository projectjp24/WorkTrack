import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { RoleEntity as Roles } from "./roles.entity";
import { PermissionEntity  } from "./permission.entity";
import { Company } from "../../company/entities/company.entity";

@Entity("role_permissions")
export class RolePermissionEntity {
  @PrimaryGeneratedColumn("uuid")
  role_permissions_id: string;

  // ---------- RELATIONS ----------

  // Many role_permissions belong to one Role
  @ManyToOne(() => Roles, (role) => role.rolePermissions, { onDelete: "SET NULL" })
  @JoinColumn({ name: "role_id" })
  role: Roles;

  // Many role_permissions belong to one Permission
  @ManyToOne(() => PermissionEntity, (permission: PermissionEntity) => permission.rolePermissions, { onDelete: "SET NULL" })
  @JoinColumn({ name: "permission_id" })
  permission: PermissionEntity;

  // Many role_permissions belong to one Company
  @ManyToOne(() => Company, (company) => company.rolePermissions, { onDelete: "SET NULL" })
  @JoinColumn({ name: "company_id" })
  company: Company;

  // ---------- STATUS FIELDS ----------
  @Column({ type: "boolean", default: false })
  is_allowed: boolean;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
