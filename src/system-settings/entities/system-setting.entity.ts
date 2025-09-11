// import { Company } from 'src/company/entities/company.entity';
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
@Unique(['company_id'])
export class SystemSetting {
  @PrimaryGeneratedColumn('uuid')   
  id: string;

  @Column('uuid')
  company_id: string;               

  @Column({ default: true })
  enable_in_app_notifications: boolean;

  @Column({type:"int",default:15})
  password_change_reminder_days: number;

  @Column({type:"int",default:20})
  default_annual_leave_balance: number;

  @Column({type:"int",default:5})
  user_idle_timeout_minutes: number;

  // @ManyToOne(()=>Company,(company)=>company.system_settings,{onDelete:"CASCADE"})
  // @JoinColumn({name:"company_id"})
  // company: Company;

  @Column({type:"uuid",nullable:true})
  updated_by: string;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;
}
