import { Roles } from "src/utility/enums/user-roles.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('usermanagement')
export class UserManagementEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    employeeId: string;
    @Column({unique: true})
    username: string;
    @Column({select: false})
    password: string;
    @Column({unique: true})
    email: string;
    @Column({type: 'enum', enum:Roles, default:[Roles.EMPLOYEE]})
    role: Roles;
    @CreateDateColumn()
    createdAt: Timestamp;
    @UpdateDateColumn()
    updatedAt: Timestamp;
}
