import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
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

            const newUser = await this.authService.createUser(
                userProfile
            )
            const accessToken = await this.authService.generateAccessToken(
                newUser.id
            )
            const refreshToken = await this.authService.generateRefreshToken()

            await this.authService.saveRefreshToken(
                newUser.id,
                refreshToken
            )

            return { accessToken, refreshToken }
        }

        const userAccessToken = await this.authService.createAccessToken(
            user.id
        )

        const userRefreshToken = await this.authService.createRefreshToken()
        await this.authService.saveRefreshToken(user.id, userRefreshToken)

        return { userAccessToken, userRefreshToken }
    }
}
