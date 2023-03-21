import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { CacheService } from 'src/util/cache/cache.service';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private userService: UserService,
        private cacheService: CacheService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: any) {
        const { id, email } = payload;
        const cachedUser = await this.cacheService.get(email);

        let user: User;
        if (cachedUser) {
            user = JSON.parse(cachedUser);
            return user;
        } 
        else {
            user = await this.userService.getUser(id);
            if (!user) {
                throw new UnauthorizedException('로그인 후 이용 가능합니다.');
            }
            return user;
        }
    }
}
