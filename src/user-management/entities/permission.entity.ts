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
import { RolePermissionEntity  } from "./roles-permission.entity";

@Entity("permissions")
export class PermissionEntity {
  @PrimaryGeneratedColumn("uuid")
  permission_id: string;

  @Column()
  permission_name: string;

  @Column()
  permission_description: string;

  // ---------- RELATIONS ----------

  // Many permissions belong to one company
  @ManyToOne(() => Company, (company) => company.permissions, { onDelete: "SET NULL" })
  @JoinColumn({ name: "company_id" })
  company: Company;

  // One permission can be linked to many role_permissions
  @OneToMany(() => RolePermissionEntity, (rp) => rp.permission)
  rolePermissions: RolePermissionEntity[];

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
