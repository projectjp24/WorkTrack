import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { userEntity } from 'src/user-management/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(userEntity)
    private authRepository: Repository<userEntity>,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    const user = await this.findByUsernameOrEmpId(createAuthDto.identifier);
    if (!user) throw new NotFoundException('user not found');

    const matchpassword = await compare(createAuthDto.password, user.password);
    if (!matchpassword) throw new BadRequestException('Incorrect password');

    delete (user as any).password;

    return user;
  }

  async findByUsernameOrEmpId(identifier: string) {
    return this.authRepository.findOne({
      where: [{ username: identifier }, { employee_id: identifier }],
      select: ['user_id', 'username', 'employee_id', 'password', 'role_id', 'email'],
    });
  }

  accesstoken = (user: userEntity) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret || typeof secret !== 'string') {
      throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }

    const expiresIn: SignOptions['expiresIn'] = '1h';

    const signOptions: SignOptions = {
      expiresIn,
    };

    return jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        employeeId: user.employee_id,
        role: user.role_id,
      },
      secret,
      signOptions,
    );
  };

  // refreshtoken = (user: UserManagementEntity) => {
  //   const secret = process.env.REFRESH_TOKEN_SECRET;

  //   console.log(secret);

    
  //   if (!secret || typeof secret !== 'string') {
  //     throw new Error('REFRESH_TOKEN is not defined');
  //   }

  //   const signOptions: SignOptions = { expiresIn: '7d' };

  //   return jwt.sign( {
  //       id: user.id,
  //       username: user.username,
  //       employeeId: user.employeeId,
  //       role: user.role,
  //     },
  //     secret,
  //     signOptions,
  //   );
  // };

}
