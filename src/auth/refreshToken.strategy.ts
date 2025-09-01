import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
            ignoreExpiration: false,
            // passReqToCallback: true
        });
        console.log('Refresh Token Secret exists:', !!configService.get<string>('REFRESH_TOKEN_SECRET'));
    }
    async validate(payload: any){
        // console.log('refresh payload', payload)
        return { userId: payload.sub, username: payload.username, role: payload.role };
    }
}