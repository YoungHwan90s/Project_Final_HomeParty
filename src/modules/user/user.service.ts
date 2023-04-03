import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Not, Repository, UpdateResult } from 'typeorm';
import { ResetPasswordDTO } from '../auth/dto/reset-password.dto';
import { PartialUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { WishList } from './entity/wish-list.entity';
import { PartyService } from '../party/party.service';
import { Kakao } from './entity/kakao.entitiy';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { CacheService } from 'src/util/cache/cache.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(WishList) private wishListRepository: Repository<WishList>,

        private readonly partyService: PartyService,
        private readonly dataSource: DataSource,
        private readonly cacheService: CacheService,
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

            let userKakaoInfo = new Kakao();
            userKakaoInfo.kakaoPrimaryId = data.kakaoPrimaryId;

            newUserWithKakao.kakao = userKakaoInfo;

            user = await queryRunner.manager.save(User, newUserWithKakao);

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

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { email, deletedAt: null },
        });

        if (!user) {
            throw new NotFoundException('회원이 존재하지 않습니다.');
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        return user;
    }

    async getUser(data: number | string): Promise<User> {
        let where;
        // 인자 값 id 일 때
        if (typeof data === 'number') {
            where = { id: data, deletedAt: null };
        }
        // 인자 값 email 일 때
        else {
            where = { email: data, deletedAt: null };
        }
        const user = await this.userRepository.findOne({
            where: where,
            relations: ['kakao']
        });

        delete user.password
        
        return user
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
        await this.cacheService.del(user.email);

        return await this.userRepository.update(user.id, {
            name: data.name,
            sex: data.sex,
            phone: data.phone,
            birthday: data.birthday,
            address: data.address,
            profile: data.profile,
            introduction: data.introduction,
        });
    }

    async deleteUser(user: User): Promise<User[]> {
        try {
            const IdkeyForRefreshToken = String(user.id);
            await this.cacheService.del(IdkeyForRefreshToken);
            await this.cacheService.del(user.email);

            const userWithRelations = await this.userRepository.find({
                where: { id: user.id },
                relations: ['party', 'wishList', 'partyMember', 'review', 'kakao'],
            });

            return await this.userRepository.softRemove(userWithRelations);
        } catch (error) {
            throw new BadRequestException('잘못된 요청입니다. 다시 시도하여 주시기 바랍니다.');
        }
    }

    async updateWishList(user: User, partyId: number): Promise<number> {
        const checkWishList = await this.wishListRepository.findOne({
            where: { partyId, userId: user.id },
        });

        if (checkWishList) {
            await this.wishListRepository.softRemove(checkWishList);
            await this.cacheService.del('parties');

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
            await this.cacheService.del('parties');
        }
        return 0;
    }

    async getWishList(userId: number): Promise<WishList[]> {
        return await this.wishListRepository.find({
            where: { 
                userId, 
                deletedAt: null,
                party: {
                    status: "모집중"
                }
             },
            relations: ['party', 'party.thumbnail', 'party.tag'],
        });
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

    async userPartyHistory(id: number): Promise<User> {

        let currentDate = new Date();
        currentDate.setUTCHours(currentDate.getUTCHours() + 9);
        let dateString = currentDate.toISOString().substring(0, 10);
        let newDate = new Date(dateString);

        let user = await this.userRepository.findOne({
            where: {
                id,
                deletedAt: null,
                partyMember: {
                    status: '승낙',
                    party: {
                        date: LessThan(newDate)
                    },
                },
            },
            relations: ['partyMember', 'partyMember.party', 'partyMember.party.thumbnail'],
        });

        return user;
    }

    async userApplyPartyList(id: number): Promise<User> {

        let currentDate = new Date();
        currentDate.setUTCHours(currentDate.getUTCHours() + 9);
        currentDate.setDate(currentDate.getDate() - 1);
        let dateString = currentDate.toISOString().substring(0, 10);
        let newDate = new Date(dateString);

        let user = await this.userRepository.findOne({
            where: {
                id,
                deletedAt: null,
                partyMember: {
                    status: Not('호스트'),
                    party: {
                        date: MoreThan(newDate)
                    },
                },
            },
            relations: ['partyMember', 'partyMember.party', 'partyMember.party.thumbnail'],
        });
        
        return user;
    }

    async searchUserPartyApplied(
        id: number,
        date: Date,
        address: string,
        title: string,
    ): Promise<User[]> {

        let currentDate = new Date();
        currentDate.setUTCHours(currentDate.getUTCHours() + 9);
        currentDate.setDate(currentDate.getDate() - 1);
        let dateString = currentDate.toISOString().substring(0, 10);
        let newDate = new Date(dateString);

        let query = this.userRepository.createQueryBuilder('user');

        query = query
            .leftJoinAndSelect('user.partyMember', 'partyMember')
            .leftJoinAndSelect('partyMember.party', 'party')
            .leftJoinAndSelect('party.thumbnail', 'thumbnail')
            .where('user.id = :id', { id })
            .andWhere('party.deletedAt IS NULL')
            .andWhere('partyMember.status != :status', { status: '호스트' })
            .andWhere('party.date >= :newDate', { newDate })
            .orderBy('party.createdAt', 'DESC');

        if (!isNaN(date.getTime())) {
            let month =
                date.getMonth() + 1 < 10
                    ? `0${(date.getMonth() + 1).toString()}`
                    : (date.getMonth() + 1).toString();
            let day =
                date.getDate() < 10 ? `0${date.getDate().toString()}` : date.getDate().toString();
            const year = date.getFullYear().toString();

            const dateStr = `${year}-${month}-${day}`;
            query = query.andWhere(`party.date= :date`, { date: dateStr });
        }
        if (address) {
            query = query.andWhere(`party.address LIKE :address`, { address: `%${address}%` });
        }
        if (title) {
            query = query.andWhere(`party.title LIKE :title`, { title: `%${title}%` });
        }

        return query.getMany();
    }

    async searchUserPartyHistory(
        id: number,
        date: Date,
        address: string,
        title: string,
    ): Promise<User[]> {
        let currentDate = new Date();
        currentDate.setUTCHours(currentDate.getUTCHours() + 9);
        currentDate.setDate(currentDate.getDate() - 1);
        let dateString = currentDate.toISOString().substring(0, 10);
        let newDate = new Date(dateString);
        let query = this.userRepository.createQueryBuilder('user');

        query = query
            .leftJoinAndSelect('user.partyMember', 'partyMember')
            .leftJoinAndSelect('partyMember.party', 'party')
            .leftJoinAndSelect('party.thumbnail', 'thumbnail')
            .where('user.id = :id', { id })
            .andWhere('party.deletedAt IS NULL')
            .andWhere('partyMember.status != :status', { status: '호스트' })
            .andWhere('party.date < :newDate', { newDate })
            .orderBy('party.createdAt', 'DESC');

        if (!isNaN(date.getTime())) {
            let month =
                date.getMonth() + 1 < 10
                    ? `0${(date.getMonth() + 1).toString()}`
                    : (date.getMonth() + 1).toString();
            let day =
                date.getDate() < 10 ? `0${date.getDate().toString()}` : date.getDate().toString();
            const year = date.getFullYear().toString();

            const dateStr = `${year}-${month}-${day}`;
            query = query.andWhere(`party.date= :date`, { date: dateStr });
        }
        if (address) {
            query = query.andWhere(`party.address LIKE :address`, { address: `%${address}%` });
        }
        if (title) {
            query = query.andWhere(`party.title LIKE :title`, { title: `%${title}%` });
        }

        return query.getMany();
    }
}
