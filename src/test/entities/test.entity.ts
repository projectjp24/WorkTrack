import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
 
} from "typeorm";

@Entity("demo_user")
export class DemoUserEntity {
    @PrimaryGeneratedColumn("uuid")
    user_id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    age: number;

   
}