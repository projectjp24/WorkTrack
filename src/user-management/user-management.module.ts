import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DepartmentEntity } from './entities/department.entity';
import { RolePermissionEntity } from './entities/roles-permission.entity';
import { RoleEntity } from './entities/roles.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RoleManagmentController } from './role-management/role-management.controller';
import { RoleManagementService } from './role-management/role-management.service';
import { DepartmentManagmentController } from './department-management/department-management.controller';
import { DepartmentManagementService } from './department-management/department-management.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,RolePermissionEntity,RoleEntity,PermissionEntity,DepartmentEntity
  ])],
  controllers: [UserManagementController, RoleManagmentController, DepartmentManagmentController],
  providers: [UserManagementService, RoleManagementService, DepartmentManagementService],
})

export class UserManagementModule {}
