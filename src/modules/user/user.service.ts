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
import { PartyService } from '../party/party.service';
import { CheckPasswordDto } from './dto/check-password.dto';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/util/cache/cache.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(WishList) private wishListRepository: Repository<WishList>,
        private readonly partyService: PartyService,
    ) {}

    async createUser(data): Promise<User> {
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
        });

        return user;
    }

    async createKakaoUser(data) {
        let user = new User();

        user.email = data.email;
        user.name = data.nickname;
        user.profile = data.profileImage;
        user.kakao.kakaoId = data.id;

        return await this.userRepository.save(user);
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
    async updateUser(user: User, data: UpdateUserDto): Promise<UpdateResult> {
        if (data.password !== data.confirmPassword) {
            throw new UnauthorizedException('입력하신 비밀번호가 일치하지 않습니다.');
        } else {
            return this.userRepository.update(user.id, {
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

    async updateWishList(user: User, partyId: number) {
        const checkWishList = await this.wishListRepository.findOne({
            where: { partyId, userId: user.id },
        });

        if (checkWishList) {
            await this.wishListRepository.delete(checkWishList.id);

            return 1;
        } else {
            const party = await this.partyService.getPartyById(partyId);
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
            relations: ['party', 'party.thumbnail', 'party.tag'],
        });
        return wishList;
    }

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { email, deletedAt: null },
        });

        if (!user) {
            throw new NotFoundException('회원이 존재하지 않습니다.');
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            throw new UnauthorizedException('비밀번호가 틀렸습니다.');
        }
        return user;
    }

    async findEmail(data): Promise<string> {
        const user = await this.userRepository.findOne({
            where: { name: data.name, phone: data.phone },
            select: ['email'],
        });

        if (!user) {
            throw new UnauthorizedException('회원이 존재하지 않습니다.');
        }

        const email = user.email;
        const index = email.indexOf('@');

        let secureEmail = null;

        if (index <= 3) {
            secureEmail = email.substring(0, index - 2) + '**' + email.substring(index);
        } else {
            secureEmail = email.substring(0, index - 3) + '***' + email.substring(index);
        }
        return secureEmail;
    }

    async readReview(hostId: number): Promise<any> {
        const reviewInfo = await this.userRepository.findOne({
            where: { id: hostId, deletedAt: null },
            relations: ['party', 'party.thumbnail', 'party.review', 'party.review.user'],
        });

        if (!reviewInfo) {
            throw new NotFoundException('리뷰가 없습니다.');
        }
        return reviewInfo;
    }

    async userHistory(user: User): Promise<any> {
        const userInfo = await this.userRepository.find({
            where: { id: user.id, deletedAt: null },
            relations: ['party', 'party.thumbnail','party.PartyMember']
        })
        return userInfo
    }
}
