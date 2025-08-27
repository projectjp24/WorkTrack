import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('permissions')
export class permission_Entity {
    @PrimaryGeneratedColumn("uuid")
    permission_id: string;
    @Column()
    permission_name: string;
    @Column()
    permission_description: string;
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
