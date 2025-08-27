import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('departments')
export class departmentEntity {
    @PrimaryGeneratedColumn("uuid")
    department_id: string;
    @Column()
    department_name: string;
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
