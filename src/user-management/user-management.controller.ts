import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { userEntity } from './entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiSecurity } from '@nestjs/swagger';


@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('create')
  async adduser(@Body() createUser: CreateUserDto) {
     await this.userManagementService.adduser(createUser);
     return { message: 'User Added Successfully' };
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('SuperAdmin')
  // @ApiSecurity("JWT-auth")
  @Get('all')
  async findAll(@Req() req: Request): Promise<userEntity[]> {
    return await this.userManagementService.findAll({ select: ['*'] });
  }

  // @Get('EmployeeId')
  // async EmployeeId(@Req() req: Request) {
  //   const user = await this.userManagementService.findAll({
  //     select: ['employeeId'],
  //   });
  //   return user.map(u => u.employee_id);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<userEntity | null> {
    return await this.userManagementService.findOne(id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUser: UpdateUserDto): Promise<userEntity> {
    return await this.userManagementService.update(id, updateUser);
  }

  @Delete('delete/:id')  
  async remove(@Param('id') id: string) {
    return await this.userManagementService.softDelete(id);
  }
}