import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('role_permissions')
export class role_permissionEntity {
    @PrimaryGeneratedColumn("uuid")
    role_permissions_id : string;
    @Column()
    role_id: number;
    @Column()
    permission_id: number;
    @Column()
    company_id: number;
    @Column()
    is_allowed: boolean;
    @Column()
    is_active: boolean;
    @Column()
    is_deleted: boolean;
    @CreateDateColumn()
    createdAt: Timestamp;
    @UpdateDateColumn()
    updatedAt: Timestamp;
}
