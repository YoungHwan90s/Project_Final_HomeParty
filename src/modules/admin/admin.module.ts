import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../party/entity/tag.entity';
import { Party } from '../party/entity/party.entity';
import { Review } from '../review/entity/review.entity';
import { ReviewService } from '../review/review.service';
import { User } from '../user/entity/user.entity';
import { WishList } from '../user/entity/wish-list.entity';
import { UserService } from '../user/user.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Review, WishList, Party,Tag])],
    controllers: [AdminController],
    providers: [AdminService, UserService, ReviewService]
})
export class AdminModule {}
