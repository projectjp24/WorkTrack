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
import { RoleEntity } from 'src/user-management/entities/roles.entity';
import { Company } from 'src/company/entities/company.entity';
 
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(userEntity)
    private authRepository: Repository<userEntity>,
  ) {}
 
 async login(dto: CreateAuthDto) {
  const user = await this.findByUsernameOrEmpId(dto.identifier);
  const ok = await compare(dto.password, user.password);
  if (!ok) throw new BadRequestException('Incorrect password');
 
  const token = this.accesstoken(user); // your existing method
  delete (user as any).password;
 
  return {
    accessToken: token,
   ...user
  };
}
 
async findByUsernameOrEmpId(identifier: string) {
  const user = await this.authRepository
    .createQueryBuilder('user')
    .innerJoinAndSelect('user.role', 'role')
    .leftJoinAndSelect('user.company', 'company')
    .where('(user.username = :identifier OR user.employee_id = :identifier)', { identifier })
    .getOne();

  if (!user) {
    throw new NotFoundException({
      code: 'USER_NOT_FOUND',
      message: 'User does not exist',
    });
  }

  if (user.is_deleted) {
    throw new BadRequestException({
      code: 'USER_DELETED',
      message: 'This user has been deleted',
    });
  }

  if (!user.is_active) {
    throw new BadRequestException({
      code: 'USER_INACTIVE',
      message: 'This user account is inactive',
    });
  }

  if (!user.company) {
    throw new BadRequestException({
      code: 'COMPANY_NOT_FOUND',
      message: 'Company not found',
    });
  }

  if (user.company.is_deleted) {
    throw new BadRequestException({
      code: 'COMPANY_DELETED',
      message: 'This company has been deleted',
    });
  }

  if (!user.company.is_active) {
    throw new BadRequestException({
      code: 'COMPANY_INACTIVE',
      message: 'This company is inactive',
    });
  }

  return user;
}
 
  // accesstoken = (user: userEntity) => {
  //   const secret = process.env.ACCESS_TOKEN_SECRET;
 
  //   if (!secret || typeof secret !== 'string') {
  //     throw new Error('ACCESS_TOKEN_SECRET is not defined');
  //   }
 
  //   const expiresIn: SignOptions['expiresIn'] = '1h';
 
  //   const signOptions: SignOptions = {
  //     expiresIn,
  //   };
 
  //   return jwt.sign(
  //     {
  //       id: user.user_id,
  //       username: user.username,
  //       employeeId: user.employee_id,
  //       role: user.role_id,
  //     },
  //     secret,
  //     signOptions,
  //   );
 
  accesstoken = (user: userEntity & { role: RoleEntity, company: Company }) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
 
    if (!secret || typeof secret !== 'string') {
      throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
 
    // console.log("User in access token:", user); // Debugging line
 
    const expiresIn: SignOptions['expiresIn'] = '1h';
 
    const signOptions: SignOptions = { expiresIn };
 
    // Build JWT payload
    const payload = {
      user_id: user.user_id,
      employee_id: user.employee_id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role?.role_name,
      company_id: user.company_id,
      branch_id: user.branch_id,
      department_id: user.department_id,
    };
 
    // console.log("JWT Payload:", payload);
 
   // Debugging line
 
    return jwt.sign(payload, secret, signOptions);
    };
 
    async decodeToken(token: string) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret || typeof secret !== 'string') {
      throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
 
    try {
    const decoded: any = jwt.verify(token, secret);
 
    // // Convert timestamps to IST
    // const options: Intl.DateTimeFormatOptions = {
    //   timeZone: 'Asia/Kolkata',
    //   year: 'numeric',
    //   month: '2-digit',
    //   day: '2-digit',
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   second: '2-digit',
    // };
 
    // if (decoded.iat) {
    //   decoded.iat_IST = new Date(decoded.iat * 1000).toLocaleString('en-IN', options);
    // }
    // if (decoded.exp) {
    //   decoded.exp_IST = new Date(decoded.exp * 1000).toLocaleString('en-IN', options);
    // }
 
    return decoded;
  } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
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
 
 