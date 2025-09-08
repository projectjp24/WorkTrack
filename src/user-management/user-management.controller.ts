import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('create/:company_id')
  async adduser(
    @Body() createUser: CreateUserDto,
    @Param('company_id') company_id: string,
  ) {
    await this.userManagementService.adduser(createUser, company_id);
    return { message: 'User Added Successfully' };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SuperAdmin')
  @ApiSecurity('JWT-auth')
  @Get('all/:company_id')
  async findAll(
    @Param('company_id') company_id: string,
  ): Promise<UserEntity[]> {
    return await this.userManagementService.findAll(company_id);
  }

  // @Get('EmployeeId')
  // async EmployeeId(@Req() req: Request) {
  //   const user = await this.userManagementService.findAll({
  //     select: ['employeeId'],
  //   });
  //   return user.map(u => u.employee_id);
  // }

  @Get(':id/:company_id')
  async findOne(
    @Param('id') id: string,
    @Param('company_id') company_id: string,
  ): Promise<UserEntity | null> {
    return await this.userManagementService.findOne(id, company_id);
  }

  @Patch('update/:id/:company_id')
  async update(
    @Param('id') id: string,
    @Param('company_id') company_id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.userManagementService.update(id, company_id, updateUser);
  }

  @Delete('delete/:id/:company_id')
  async remove(
    @Param('id') id: string,
    @Param('company_id') company_id: string,
  ) {
    return await this.userManagementService.softDelete(id, company_id);
  }
}
