import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entity/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async createUser(data: CreateUserDto) {
        const existUser = await this.findUserByEmail(data.email);

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

    async findUserByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email, deletedAt: null },
            select: ['password'],
        });
    }

    async validateUser(email: string, password: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { email, deletedAt: null },
                select: ['email', 'password'],
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

    // async login(data: LoginDto) {
    //     const user = await this.validateUser(data.email);
    //     const comparePassword =  await bcrypt.compare(data.password, user.password);

    //     if (!comparePassword) {
    //         throw new UnauthorizedException("비밀번호가 일치하지 않습니다.")
    //     }

    //     const accessToken = sign(user.id)
    //     const refreshToken = refresh()

    //     redisClient.setEx(user.id, 86400, refreshToken);

    //     return { accessToken, refreshToken };

    // }
}
