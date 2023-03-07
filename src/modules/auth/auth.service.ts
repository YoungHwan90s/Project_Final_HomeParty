import {
    BadRequestException,
    HttpException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../cache/cache.service';
import { FindEmailDto } from './dto/find-email.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private readonly cacheService: CacheService,
    ) {}

    async validateUser(email: string, password: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { email, deletedAt: null }
            });

            if (!user) {
                throw new UnauthorizedException('회원이 존재하지 않습니다.');
            }

            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                throw new UnauthorizedException('비밀번호가 틀렸습니다.');
            }
            return user;
        } catch (error) {
            console.log(error);
            throw new BadRequestException('잘못된 요청입니다.');
        }
    }

    async login(user: any): Promise<any> {
        try {
            const accessToken = await this.generateAccessToken(user.id);
            const refreshToken = await this.generateRefreshToken();

            await this.cacheService.set(user.id, refreshToken);

            return { accessToken, refreshToken };
        } catch (error) {
            throw new HttpException('로그인에 실패하였습니다.', 400);
        }
    }

    async generateAccessToken(id: number): Promise<string> {
        const payload = { id };
        return this.jwtService.sign(payload);
    }

    async generateRefreshToken() {
        return this.jwtService.sign({}, { expiresIn: '1d' });
    }

    async verifyAccessToken(token: string) {
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

    async findEmail(data: FindEmailDto): Promise<string> {
        try {
            const user = await this.userRepository.findOne({
                where: { name: data.name, phone: data.phone },
                select: ['email'],
            });

            const email = user.email;
            const index = email.indexOf('@');

            let secureEmail = null;

            if (index <= 3) {
                secureEmail = email.substring(0, index - 2) + '**' + email.substring(index);
            } else {
                secureEmail = email.substring(0, index - 3) + '***' + email.substring(index);
            }
            return secureEmail;
        } catch (error) {
            throw new HttpException('요청에 실패하였습니다.', 400);
        }
    }
}
