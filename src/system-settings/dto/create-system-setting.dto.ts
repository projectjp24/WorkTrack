import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CreateSystemSettingDto {
  @ApiProperty({ example: true, description: 'Enable or disable in-app notifications' })
  @IsBoolean()
  enable_in_app_notifications: boolean;

  @ApiProperty({ example: 30, description: 'Days after which user must change password' })
  @IsInt()
  password_change_reminder_days: number;

  @ApiProperty({ example: 24, description: 'Default annual leave balance for employees' })
  @IsInt()
  default_annual_leave_balance: number;

  @ApiProperty({ example: 15, description: 'Idle timeout in minutes before auto-logout' })
  @IsInt()
  user_idle_timeout_minutes: number;

  @ApiProperty({ example: 'e5b2d7a1-8b77-4c3f-9f52-1f5e2b0e7d23', description: 'Associated company ID' })
  @IsUUID()
  @IsNotEmpty()
  company_id: string;

  @ApiProperty({ example: 'e5b2d7a1-8b77-4c3f-9f52-1f5e2b0e7d23', description: 'User who last updated this setting' })
  @IsUUID()
  @IsNotEmpty()
  updated_by: string;
}
