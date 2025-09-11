import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { CreateSystemSettingDto } from './dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';

@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly settingService: SystemSettingsService) {}

  @Post()
  create(@Body() createSystemSettingDto: CreateSystemSettingDto) {
    return this.settingService.create(createSystemSettingDto);
  }

  // @Get()
  // findAll() {
  //   return this.settingService.findAll();
  // }

  @Get('setting/:company_id')
  findByCompany(@Param('company_id') company_id: string) {
    return this.settingService.findByCompany(company_id);
  }

  @Put("setting/:company_id")
  async update(@Param("company_id") company_id: string, @Body() dto: UpdateSystemSettingDto) {
    return this.settingService.update(company_id, dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.settingService.remove(+id);
  // }
}
