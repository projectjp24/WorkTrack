    import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

    @Entity('users')
    export class userEntity {
        @PrimaryGeneratedColumn("uuid")
        user_id: string;
        @Column({unique: true})
        employee_id: string;
        @Column()
        company_id: string;
        @Column({nullable: true})
        branch_id?: string;
        @Column()
        first_name: string;
        @Column()
        last_name: string;
        @Column({unique: true})
        username: string;
        @Column()
        email: string;
        @Column()
        password: string;
        @Column()
        address: string;
        @Column({select: false})
        phone_number: string;
        @Column()
        date_of_birth: string;
        @Column()
        department_id: string;
        @Column()
        status: string;
        @Column()
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
