import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
      ) {}

      async createUser(data: CreateUserDto) {
        const existUser = await this.getUserInfo(data.email);

        if (existUser) {
          throw new ConflictException("입력하신 이메일로 가입된 회원이 존재합니다.")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)
        data.password = hashedPassword

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
        })
        
        return
      }

      async getUserInfo(email: string) {
        return await this.userRepository.findOne({
          where: {email, deletedAt: null},
          select: ["name"],
        })
      }

}
