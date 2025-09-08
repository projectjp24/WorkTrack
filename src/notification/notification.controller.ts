import { Body, Controller, Post, Patch, Param, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notifService: NotificationService) {}

  @Post('create')
  async createForUser(@Body() dto: CreateNotificationDto) {
     console.log('DTO from request:', dto);
    return this.notifService.createForUser(
      dto.company_id,
      dto.user_id,
      dto.title,
      dto.message,
    );
  }

  @Post('broadcast')
  async broadcast(@Body() dto: BroadcastNotificationDto) {
    return this.notifService.broadcastToCompany(
      dto.company_id,
      dto.userIds,
      dto.title,
      dto.message,
    );
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notifService.markAsRead(id, dto.is_read);
  }

  @Get('user/:user_id')
  async getUserNotifications(@Param('user_id') user_id: string) {
    return this.notifService.getUserNotifications(user_id);
  }
}
