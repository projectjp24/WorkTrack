import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  company_id: string;

  @IsUUID()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
