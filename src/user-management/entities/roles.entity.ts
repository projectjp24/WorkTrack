import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('roles')
export class roleEntity {
    @PrimaryGeneratedColumn("uuid")
    role_id: string;
    @Column()
    role_name: string;
    @Column()
    company_id: number;
    @Column()
    is_active: boolean;
    @Column()
    is_deleted: boolean;
    @CreateDateColumn()
    createdAt: Timestamp;
    @UpdateDateColumn()
    updatedAt: Timestamp;
}
