import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from './entities/user.entity';
import { departmentEntity } from './entities/department.entity';
import { role_permissionEntity } from './entities/roles-permission.entity';
import { roleEntity } from './entities/roles.entity';
import { permission_Entity } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity,role_permissionEntity,roleEntity,permission_Entity,departmentEntity
  ])],
  controllers: [UserManagementController],
  providers: [UserManagementService],
})

export class UserManagementModule {}
