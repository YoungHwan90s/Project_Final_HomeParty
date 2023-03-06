import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
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

    async createUser(data: CreateUserDto) {
        const existUser = await this.getUser(data.email);

        if (existUser) {
            throw new ConflictException('입력하신 이메일로 가입된 회원이 존재합니다.');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        await this.userRepository.insert({
            email: data.email,
            password: data.password,
            name: data.name,
            sex: data.sex,
            phone: data.phone,
            birthday: data.birthday,
            region: data.region,
            address: data.address,
            profile: data.profile,
            introduction: data.introduction,
        });

        return;
    }

    async getUser(data: any): Promise<User> {
        let where = {};

        if (typeof data === 'number') {
            where = { id: data, deletedAt: null };
        } else {
            where = { email: data, deletedAt: null };
        }
        return await this.userRepository.findOne({ where });
    }

    async validateUser(email: string, password: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { email, deletedAt: null },
                select: ['id', 'email', 'password'],
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
        }
    }

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

    async findEmail(data: FindEmailDto) {
        const user = await this.userRepository.findOne({
            where: { name: data.name, phone: data.phone },
            select: ['email']
        });
    
        const email = user.email
        const index = email.indexOf('@');

        let secureEmail = null;
        
        if (index <= 3) {
            secureEmail = email.substring(0, index - 2) + '***' + email.substring(index)
          } else {
            secureEmail = email.substring(0, index - 3) + '***' + email.substring(index)
          }
          return secureEmail
    }
}
