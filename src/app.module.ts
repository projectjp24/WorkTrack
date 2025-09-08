import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/dataSource';
import { UserManagementModule } from './user-management/user-management.module';

import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { NotificationsModule } from './notification/notification.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UserManagementModule, AuthModule, CompanyModule, SystemSettingsModule,NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
