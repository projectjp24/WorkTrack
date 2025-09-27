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
import { InvoiceModule } from './invoice/invoice.module';
import { CustomerModule } from './customer/customer.module';

import { PurchaseOrderModule } from './accounts/purchase_order/purchase_order.module';
import { VendorManagementModule } from './accounts/vendor-management/vendor-management.module';



@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UserManagementModule, AuthModule, CompanyModule, SystemSettingsModule,NotificationsModule, InvoiceModule, CustomerModule,
    PurchaseOrderModule,
    VendorManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
