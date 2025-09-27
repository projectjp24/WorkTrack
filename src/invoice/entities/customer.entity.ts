import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Invoice } from "./invoice.entity";
import { Project } from "./project.entity";


@Entity("customer")
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  customer_id: string;

  @Column('uuid')
  company_id: string;

  @Column({ unique: false, length: 20 })
  customer_code: string

  @Column({ length: 200 })
  customer_name: string;

  @Column({ length: 15, nullable: true })
  customer_phone?: string;

  @Column()
  customer_email: string;

  @Column({ type: 'text', nullable: true })
  customer_address?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 100, nullable: true })
  state?: string;
  @Column({ length: 100, nullable: true })
  pincode?: string;

  @Column({ length: 15, unique: false, nullable: true })
  customer_gstin?: string;

  @Column({ length: 2, nullable: true })
  customer_state_code?: string;


  @Column({ length: 10, nullable: true })
  pan_number?: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  created_by?: string;

  @Column({ nullable: true })
  updated_by?: string;

  // Relations
  @OneToMany(() => Invoice, invoice => invoice.customer)
  invoices: Invoice[];

  @OneToMany(() => Project, project => project.customer)
  projects: Project[];

}