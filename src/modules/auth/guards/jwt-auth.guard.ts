import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const authorization = req.headers['authorization'];
        const refreshToken = req.headers['refreshtoken'];

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return false;
        }
        const token = authorization.split(' ')[1];

        try {
            const decodedAccessToken = await this.authService.verifyAccessToken(token);
            if (decodedAccessToken.type === true) {
                return super.canActivate(context);
            }

            if (decodedAccessToken.type === false) {
                const verifyRefreshToken = await this.authService.verifyRefreshToken(
                    refreshToken,
                    decodedAccessToken.id,
                );

                if (verifyRefreshToken === false) {
                    return false;
                }
                if (verifyRefreshToken === true) {
                    const newAccessToken = await this.authService.generateAccessToken(
                        decodedAccessToken.id, decodedAccessToken.email
                    );

                    res.header('authorization', `Bearer ${newAccessToken}`);

                    return super.canActivate(context);
                }
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException('로그인 후 이용 가능합니다.');
        }
        return user;
    }
}
