import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { verify } from 'crypto';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const header = req.headers['authorization'];
        const refreshToken = res.cookies;

        // header 토큰 확인
        if (!header || !header.startsWith('Bearer ')) {
            return false;
        }
        const token = header.split(' ')[1];

        // access token 유효성 확인
        try {
            const decode = await this.authService.verifyAccessToken(token);

            if (decode.type === true) {
                return true;
            }

            if (decode.type === false) {
                const verifyRefreshToken = await this.authService.verifyRrefreshToken(
                    refreshToken,
                    decode.id,
                );

                // refresh token 유효 X
                if (verifyRefreshToken === false) {
                    return false;
                }

                // refresh token 유효 O
                if (verifyRefreshToken === true) {
                    const newAccessToken = await this.authService.generateAccessToken(decode.id);

                    res.header('Authorization', `Bearer ${newAccessToken}`);

                    return true;
                }
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
