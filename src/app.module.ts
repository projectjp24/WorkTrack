import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/dataSource';
import { UserManagementModule } from './user-management/user-management.module';

import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), CompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
