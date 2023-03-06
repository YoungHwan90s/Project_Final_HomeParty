import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Body, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email', // 원래 username으로 셋팅되어 있는걸, 내 변수 이름에 맞게 명시해줘야함
            passwordField: 'password',
            passReqToCallback: false,
        }
        );
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('회원이 존재하지 않거나 비밀번호가 틀렸습니다.');
        }
        return user;
    }
}
