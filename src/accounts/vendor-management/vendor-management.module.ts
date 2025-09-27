import { Module } from '@nestjs/common';
import { VendorManagementService } from './vendor-management.service';
import { VendorManagementController } from './vendor-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './entities/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])],
  controllers: [VendorManagementController],
  providers: [VendorManagementService],
})
export class VendorManagementModule {}
