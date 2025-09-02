import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { userEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectRepository(userEntity)
    private userRepository: Repository<userEntity>,
  ) {}

  async adduser(createUserDto: CreateUserDto) {
    const existingUser = await this.findUserByUsername(createUserDto.username);
    if (existingUser) throw new Error('user with this username already exists');

    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await hash(createUserDto.password, salt);

    let user = this.userRepository.create({
      ...createUserDto,
      is_active: true,
    });

    user = await this.userRepository.save(user);
    return user;
  }

  async findAll(company_id: string): Promise<userEntity[]> {
    const users = await this.userRepository.
    createQueryBuilder('user')
    .innerJoinAndSelect('user.role', 'role')
    .innerJoinAndSelect('user.department', 'department')
    .innerJoinAndSelect('user.company', 'company')
    .where('user.is_deleted = :is_deleted AND user.is_active = :is_active', { is_deleted: false, is_active: true})
    .andWhere('user.company_id = :company_id', { company_id })
    .select([
      'user.user_id',
      'user.employee_id',
      'user.company_id',
      'company.company_name',
      'user.branch_id',
      'user.first_name',
      'user.last_name',
      'user.username',
      'user.email',
      'user.address',
      'user.phone_number',
      'user.date_of_birth',
      'user.department_id',
      'department.department_name',
      'user.status',
      'user.role_id',
      'role.role_name',
    ])
    .getMany()

    return users;
  }

  async findOne(user_id: string): Promise<userEntity | null> {
    return await this.userRepository.findOne({
      where: {
        user_id,
        is_deleted: false,
        is_active: true,
      }
    });
  }

  async update(
    user_id: string,
    fields: Partial<UpdateUserDto>,
  ): Promise<userEntity> {
    const user = await this.findOne(user_id);
    if (!user) throw new NotFoundException('User Not Found');

    if (fields.password && fields.password.trim() !== ''){
      const salt = await bcrypt.genSalt(10);
      fields.password = await bcrypt.hash(fields.password, salt);
    } else{
      delete fields.password;
    }

    Object.assign(user, fields);
    return this.userRepository.save(user);
  }

  async softDelete(user_id: string) {
    const user = await this.findOne(user_id);
    if (!user) throw new NotFoundException('User Not Found');

    // Update only the is_deleted field instead of removing
    await this.userRepository.update(user_id, { is_deleted: true, is_active: false });

    return { message: 'User has been deleted successfully.' };
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }
}
