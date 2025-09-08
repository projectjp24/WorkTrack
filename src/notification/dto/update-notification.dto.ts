import { IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @IsBoolean()
  is_read: boolean;
}