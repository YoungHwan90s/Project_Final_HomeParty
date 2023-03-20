import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserService } from 'src/modules/user/user.service';
import { CacheService } from 'src/util/cache/cache.service';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly cacheService: CacheService,
    ) {
        super({
            clientID: configService.get<string>('RESTAPI_KEY'),
            callbackURL: configService.get<string>('CALLBACK_URL'),
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        
        const id = profile.id;
        const email = profile._json.kakao_account.email
        const nickname = profile._json.properties.nickname
        const profileImage = profile._json.properties.profile_image

        const user = await this.userService.getUser(email)
        if (!user) {

            const userProfile = {
                kakaoId : id,
                email,
                nickname,
                profileImage,
            }

            const user = await this.userService.createKakaoUser(
                userProfile
            )

            const accessToken = await this.authService.generateAccessToken(user.id)
            const refreshToken = await this.authService.generateRefreshToken()
            
            const redisKey = String(user.id)
            await this.cacheService.set(redisKey, refreshToken);

            return { user, accessToken, refreshToken }

        } else {
            const accessToken = await this.authService.generateAccessToken(user.id)
            const refreshToken = await this.authService.generateRefreshToken()
            const redisKey = String(user.id)
            await this.cacheService.set(redisKey, refreshToken);    

            return { user, accessToken, refreshToken }
        }
    }
}
