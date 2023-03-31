import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from 'src/util/cache/cache.service';
import { AuthModule } from '../auth/auth.module';
import { PartyMember } from '../party/entity/party-member.entity';
import { Party } from '../party/entity/party.entity';
import { Tag } from '../party/entity/tag.entity';
import { PartyService } from '../party/party.service';
import { Kakao } from '../user/entity/kakao.entitiy';
import { User } from '../user/entity/user.entity';
import { WishList } from '../user/entity/wish-list.entity';
import { UserService } from '../user/user.service';
import { Review } from './entity/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
    imports: [TypeOrmModule.forFeature([Review, User, WishList, Party, PartyMember, Kakao, Tag]), AuthModule],
    controllers: [ReviewController],
    providers: [ReviewService, UserService, PartyService, CacheService],
})
export class ReviewModule {}
