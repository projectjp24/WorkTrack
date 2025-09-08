import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('system_settings')
@Unique(['company_id'])
export class SystemSetting {
  @PrimaryGeneratedColumn('uuid')   // generates UUID v4 automatically
  id: string;

  @Column('uuid')
  company_id: string;               // plain UUID column, not linked to Company entity

  @Column({ default: true })
  enable_in_app_notifications: boolean;
}
