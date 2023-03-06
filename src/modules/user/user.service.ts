import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
        return await this.userRepository.findOne({
            where: { id }
        });
    }

    async updateUser(id: number, data: UpdateUserDto): Promise<void> {
        const user = await this.getUserById(id);
        
        await this.userRepository.update(id, {
            // email: data.email,
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
    }

    async deleteUser(id: number) {
        return this.userRepository.softDelete(id);
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