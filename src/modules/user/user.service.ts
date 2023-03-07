import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpException,
    Injectable, NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetPasswordDTO } from '../auth/dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async createUser(data: CreateUserDto) {
        try {
            const existUser = await this.getUser(data.email);

            if (existUser) {
                throw new ConflictException('입력하신 이메일로 가입된 회원이 존재합니다.');
            }

            if (!existUser) {
                const hashedPassword = await bcrypt.hash(data.password, 10);

                await this.userRepository.insert({
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    sex: data.sex,
                    phone: data.phone,
                    birthday: data.birthday,
                    region: data.region,
                    address: data.address,
                    profile: data.profile,
                    introduction: data.introduction,
                });
            }
            return;
        } catch (error) {
            throw new HttpException('회원가입에 실패하였습니다.',400);
          }
    }

    async getUser(data: any): Promise<User> {
        try {
            let where = {};

            // 인자 값 id 일 때
            if (typeof data === 'number') {
                where = { id: data, deletedAt: null };
            }
            // 인자 값 email 일 때
            else {
                where = { email: data, deletedAt: null };
            }

            return await this.userRepository.findOne({ where });
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException('잘못된 요청입니다.');
        }
    }

    async resetPassword(data: ResetPasswordDTO) {
      try {
        if (data.password !== data.confirmPassword) {
            throw new UnauthorizedException('입력하신 비밀번호가 일치하지 않습니다.');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return await this.userRepository.update(
            {
                email: data.email,
            },
            {
                password: hashedPassword,
            },
        );
      } catch (error) {
        console.log(error)
        throw new HttpException('요청에 실패하였습니다.', 400);
      }
    }


    async updateUser(user: object, data: UpdateUserDto) {
        try {
            if (data.password !== data.confirmPassword) {
                throw new UnauthorizedException('입력하신 비밀번호가 일치하지 않습니다.');
            } else {
                const hashedPassword = await bcrypt.hash(data.password, 10);

                return this.userRepository.update(user['id'], {
                    password: hashedPassword,
                    name: data.name,
                    sex: data.sex,
                    phone: data.phone,
                    birthday: data.birthday,
                    region: data.region,
                    address: data.address,
                    profile: data.profile,
                    introduction: data.introduction,    
                });
            }
        } catch (error) {
            console.log(error)
            throw new BadRequestException('잘못된 요청입니다.');
        }
    }

    async deleteUser(id: number) {
        try {
            return this.userRepository.softDelete(id);
        } catch (error) {
            throw new BadRequestException('잘못된 요청입니다.')
        }
    }

    private async checkPassword(id: number, password: string) {
        const user = await this.userRepository.findOne({
            where: { id, deletedAt: null },
            select: [ "password" ],
        });
        if (!user) {
            throw new NotFoundException(`User not found. id: ${id}`);
        }
        if (user.password !== password.toString()) {
            throw new UnauthorizedException(`User password is not correct. id: ${id}`);
        }
    }
}
