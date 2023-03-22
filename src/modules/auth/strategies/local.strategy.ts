import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: false,
        }
        );
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.userService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('회원이 존재하지 않거나 비밀번호가 틀렸습니다.');
        }
        return user;
    }
}
