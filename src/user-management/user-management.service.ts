import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { userEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectRepository(userEntity)
    private userRepository: Repository<userEntity>,
  ) {}

  async adduser(createUserDto: CreateUserDto) {
    const existingUser = await this.findUserByUsername(createUserDto.username);
    if (existingUser) throw new Error('user with this username already exists');

    createUserDto.password = await hash(createUserDto.password, 10);

    let user = this.userRepository.create({
      ...createUserDto,
      is_active: true,
    });

    user = await this.userRepository.save(user);
    return user;
  }

  async findAll(p0: { select: string[] }): Promise<userEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(user_id: string): Promise<userEntity | null> {
    return await this.userRepository.findOneBy({ user_id });
  }

  async update(
    user_id: string,
    fields: Partial<UpdateUserDto>,
  ): Promise<userEntity> {
    const user = await this.findOne(user_id);
    if (!user) throw new NotFoundException('User Not Found');
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
