import { Controller, Post, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiSecurity } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async create(@Body() createAuthDto: CreateAuthDto) {
    const user = await this.authService.login(createAuthDto);
    const AccessToken = await this.authService.accesstoken(user);
    // const RefreshToken = await this.authService.refreshtoken(user);
    return {user, AccessToken};
  }

  @Post('/decode-token')
  async decodeToken(@Body('token') token: string) {
  return this.authService.decodeToken(token);
  }
}


  // @UseGuards(AuthGuard('jwt-refresh'))
  // @ApiSecurity("JWT-refresh")
  // @Post('/refresh-token')
  // async refresh(@Req() req: any){
  //   const user = req.user;
  //   const newAccessToken = this.authService.accesstoken(user);

  //   return { accessToken: newAccessToken, 
  //     user : user
  //   }
  // }
