import { IsUUID, IsString, IsNotEmpty, IsArray } from 'class-validator';

export class BroadcastNotificationDto {
  @IsUUID()
  company_id: string;

  @IsArray()
  @IsUUID('all', { each: true })
  userIds: string[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
