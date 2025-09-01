import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/dataSource';
// import { UserManagementModule } from './user-management/user-management.module';

// import { AuthModule } from './auth/auth.module';
// import { CompanyModule } from './company/company.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions) ,TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
