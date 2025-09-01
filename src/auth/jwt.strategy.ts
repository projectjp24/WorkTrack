import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }
  async validate(payload: any) {
    // console.log('access payload', payload);
    return {
      user_id: payload.user_id,
      employee_id: payload.employee_id,
      username: payload.username,
      email: payload.email,
      role_id: payload.role_id,
      role_name: payload.role_name,
      company_id: payload.company_id,
      branch_id: payload.branch_id,
      department_id: payload.department_id,
    };
  }
}
