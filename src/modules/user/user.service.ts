import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ResetPasswordDTO } from '../auth/dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { WishList } from './entity/wish-list.entity';
import { Party } from '../party/entity/party.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(WishList) private wishListRepository: Repository<WishList>,
        @InjectRepository(Party) private partyRepository: Repository<Party>,
    ) {}

    async createUser(data: CreateUserDto): Promise<User> {
        const existUser = await this.getUser(data.email);

        if (existUser) {
            throw new ConflictException('입력하신 이메일로 가입된 회원이 존재합니다.');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.save({
            email: data.email,
            password: hashedPassword,
            name: data.name,
            sex: data.sex,
            phone: data.phone,
            birthday: data.birthday,
            address: data.address,
            profile: data.profile,
            introduction: data.introduction,
        });

        return user;
    }

    async updateUserProfile(data): Promise<UpdateResult> {
        const { id, profile } = data;
        return await this.userRepository.update(id, { profile });
    }

    async getUser(data: any): Promise<User> {
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
    }

    async resetPassword(data: ResetPasswordDTO): Promise<UpdateResult> {
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
    }
    async updateUser(user: object, data: UpdateUserDto): Promise<UpdateResult> {
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
                address: data.address,
                profile: data.profile,
                introduction: data.introduction,
            });
        }
    }

    async deleteUser(id: number): Promise<DeleteResult> {
        return this.userRepository.softDelete(id);
    }

    async getUsersAdmin() {
        return await this.userRepository.find({ withDeleted: true });
    }

    async deletedUserAdmin(userId: number) {
        return await this.userRepository.softDelete(userId);
    }

    // private async checkPassword(id: number, password: string) {
    //     const user = await this.userRepository.findOne({
    //         where: { id, deletedAt: null },
    //         select: [ "password" ],
    //     });
    //     if (!user) {
    //         throw new NotFoundException(`User not found. id: ${id}`);
    //     }
    //     if (user.password !== password.toString()) {
    //         throw new UnauthorizedException(`User password is not correct. id: ${id}`);
    //     }
    // }

    async updateWishList(user: User, partyId: number): Promise<WishList | Number> {
        const checkWishList = await this.wishListRepository.findOne({
            where: { partyId, userId: user.id },
        });

        if (checkWishList) {
            await this.wishListRepository.delete(checkWishList.id);

            return 1;
        } else {
            const party = await this.partyRepository.findOne({ where: { id: partyId } });
            if (!party) {
                throw new NotFoundException('파티가 존재하지 않습니다.');
            }
            const wishList = new WishList();
            wishList.party = party;
            wishList.user = user;

            await this.wishListRepository.save(wishList);
        }
        return 0;
    }

    async getWishList(userId: number): Promise<WishList[]> {
        const wishList = await this.wishListRepository.find({
            where: { userId },
            relations: ['party', 'party.thumbnail', 'party.partyTagMapping.tag'],
        });
        return wishList;
    }
}
