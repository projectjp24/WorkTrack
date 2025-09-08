// notification.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { SystemSetting } from 'src/system-settings/entities/system-setting.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { SystemSetting } from '../system-settings/entities/system-setting.entity'; // Correct path
import { NotificationsGateway } from './notification.gateway';

// import { Notification } from './notification.entity';
// import { SystemSetting } from './system-setting.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,

    @InjectRepository(SystemSetting)
    private readonly settingsRepo: Repository<SystemSetting>,

    private notificationGateway: NotificationsGateway,
  ) { }

  async createForUser(
    company_id: string,
    user_id: string,
    title: string,
    message: string,
  ): Promise<Notification> {
    const setting = await this.settingsRepo.findOne({ where: { company_id } });
    console.log("test", company_id, title)
    if (!setting) {
      throw new NotFoundException(`System setting not found for company ${company_id}`);
    }

    if (!setting.enable_in_app_notifications) {
      throw new Error('In-app notifications are disabled for this company.');
    }
    const entity = this.notifRepo.create({
      company_id,
      user_id,
      title,
      message,
    });
    const savedNotif = await this.notifRepo.save(entity);
    this.notificationGateway.emitToUser(user_id, savedNotif);
    return savedNotif;
  }

  async broadcastToCompany(
    company_id: string,
    userIds: string[],
    title: string,
    message: string,
  ): Promise<Notification[]> {
    const setting = await this.settingsRepo.findOne({ where: { company_id } });

    if (!setting) {
      throw new NotFoundException(`System setting not found for company ${company_id}`);
    }

    if (!setting.enable_in_app_notifications) {
      throw new Error('In-app notifications are disabled for this company.');
    }

    const entities = userIds.map((uid) =>
      this.notifRepo.create({
        company_id,
        user_id: uid,
        title,
        message,
      }),
    );

    
     const savedNotifComp = await this.notifRepo.save(entities);
     this.notificationGateway.emitToCompany(company_id, entities);
     return savedNotifComp
    
  }
  async markAsRead(id: string, is_read: boolean): Promise<Notification> {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new Error('Notification not found');
    notif.is_read = is_read;
    return this.notifRepo.save(notif);
  }

  async getUserNotifications(user_id: string): Promise<Notification[]> {
    return this.notifRepo.find({
      where: { user_id },
      order: { created_at: 'DESC' },
    });
  }
}
