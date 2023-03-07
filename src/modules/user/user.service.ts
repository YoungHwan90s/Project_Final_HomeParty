import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
      ) {}

    async getUserById(id: number): Promise<User> {
        try {
            return await this.userRepository.findOne({
                where: { id }
            });
        } catch (error) {
            error.status = 401
            throw new UnauthorizedException('로그인 후 이용 바랍니다.')
        }
    }

    async updateUser(id: number, data: UpdateUserDto): Promise<void> {
        try {
            const user = await this.getUserById(id);
            await this.userRepository.update(id, {
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
        } catch (error) {
            error.status = 400
            throw new ConflictException('이메일은 수정할 수 없습니다.')
        }
    }

    async deleteUser(id: number) {
        try {
            return this.userRepository.softDelete(id);
        } catch (error) {
            error.status = 400
            throw new ConflictException('유효하지 않은 요청입니다.')
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