import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSystemSettingDto } from './dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemSetting } from './entities/system-setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SystemSettingsService {
constructor(
  @InjectRepository(SystemSetting)
  private readonly settingRepo:Repository<SystemSetting>
){}
async create(createDto:CreateSystemSettingDto):Promise<SystemSetting>{
  const setting=this.settingRepo.create({
    ...createDto,
  });
  console.log("Creating system setting:", setting);
  return await this.settingRepo.save(setting);
}
  async findByCompany(company_id: string): Promise<SystemSetting> {
    const setting = await this.settingRepo.findOne({ where: { company_id } });
    if (!setting) {
      throw new NotFoundException("System settings not found for this company");
    }
      return setting;
    }


    async update(company_id: string, updateDto: UpdateSystemSettingDto): Promise<SystemSetting> {
      const setting = await this.findByCompany(company_id);
      
    Object.assign(setting, updateDto, {
      updated_by: updateDto.updated_by,
    });
      return await this.settingRepo.save(setting);
  }
}