import {
    ConflictException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ResetPasswordDTO } from '../auth/dto/reset-password.dto';
import { PartialUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { WishList } from './entity/wish-list.entity';
import { PartyService } from '../party/party.service';
import { Kakao } from './entity/kakao.entitiy';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(WishList) private wishListRepository: Repository<WishList>,

        private readonly partyService: PartyService,
        private readonly dataSource: DataSource,
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
        });

        return user;
    }

    async createKakaoUser(data): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let user: User;
        try {
            let newUserWithKakao = new User();
            newUserWithKakao.email = data.email;
            newUserWithKakao.name = data.nickname;
            newUserWithKakao.profile = data.profileImage;

            user = await queryRunner.manager.save(User, newUserWithKakao);

            let userKakaoInfo = new Kakao();
            userKakaoInfo.userId = user.id;
            userKakaoInfo.kakaoId = data.kakaoId;

            await queryRunner.manager.save(Kakao, userKakaoInfo);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotAcceptableException(
                '로그인에 실패하였습니다. 로그인에 필요한 정보가 제공되지 않았습니다.',
            );
        } finally {
            await queryRunner.release();
        }
        return user;
    }

    async updateUserProfile(data: CreateUserProfileDto): Promise<UpdateResult> {
        const { id, profile } = data;
        return await this.userRepository.update(id, { profile });
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

    async getUser(data: number | string): Promise<User> {
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
    async updateUser(user: User, data: PartialUserDto): Promise<UpdateResult> {
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

    async userHistory(user: number): Promise<any> {
        return await this.userRepository.find({
            where: { id: user, deletedAt: null },
            relations: ['partyMember', 'partyMember.party'],
        });
    }
}
