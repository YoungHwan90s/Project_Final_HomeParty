import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService, 
        private authService: AuthService) {
        super({
            /* creates a new extractor that looks for the JWT
             in the authorization header with the scheme 'bearer' */
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: any) {
        const { id } = payload;
        const user = await this.authService.getUser(id);

        if (!user) {
            throw new UnauthorizedException('로그인 후 이용 가능합니다.');
        }
        return user;
    }
}
