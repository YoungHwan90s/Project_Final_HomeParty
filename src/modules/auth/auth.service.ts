import { Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../util/cache/cache.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly cacheService: CacheService,
    ) {}

    async login(user: any): Promise<any> {
        const accessToken = await this.generateAccessToken(user.id);
        const refreshToken = await this.generateRefreshToken();

        await this.cacheService.set(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    async generateAccessToken(id: number): Promise<string> {
        const payload = { id };
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
            };
        } catch (error) {
            const decoded = await this.jwtService.verify(token, { ignoreExpiration: true });
            return {
                type: false,
                id: decoded.id,
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
