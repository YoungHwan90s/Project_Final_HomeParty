import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../util/cache/cache.service';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private readonly cacheService: CacheService) {}

    async login(user: User): Promise<any> {
        const accessToken = await this.generateAccessToken(user.id, user.email);
        const refreshToken = await this.generateRefreshToken();

        const IdkeyForRefreshToken = String(user.id);
        await this.cacheService.set(IdkeyForRefreshToken, refreshToken);

        const EmailkeyForUser = user.email;
        
        delete user.password

        const userInfo = JSON.stringify(user);
        await this.cacheService.set(EmailkeyForUser, userInfo);

        return { accessToken, refreshToken };
    }

    async generateAccessToken(id: number, email: string): Promise<string> {
        const payload = { id, email };
        return this.jwtService.sign(payload);
    }

    async generateRefreshToken(): Promise<string> {
        return this.jwtService.sign({}, { expiresIn: '1d' });
    }

    async verifyAccessToken(token: string): Promise<any> {
        try {
            const decoded = await this.jwtService.verify(token);
            return {
                type: true,
                id: decoded.id,
                email: decoded.email,
            };
        } catch (error) {
            const decoded = await this.jwtService.verify(token, { ignoreExpiration: true });
            return {
                type: false,
                id: decoded.id,
                email: decoded.email,
                message: error.message,
            };
        }
    }

    async verifyRefreshToken(refreshToken: string, id: string): Promise<boolean> {
        try {
            const redisRefreshToken = await this.cacheService.get(id);

            if (!redisRefreshToken) {
                return false;
            }

            if (refreshToken === redisRefreshToken) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
}
