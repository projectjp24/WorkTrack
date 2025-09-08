import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSetting } from '../system-settings/entities/system-setting.entity';
import { NotificationsGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
// import { Notification } from './notification.entity';
// import { SystemSetting } from '../system-settings/system-setting.entity';
// import { NotificationsService } from './notifications.service';
// import { NotificationsGateway } from './notifications.gateway';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, SystemSetting])],
  providers: [NotificationService, NotificationsGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationsModule {}
