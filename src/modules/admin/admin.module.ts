import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../party/entity/tag.entity';
import { Party } from '../party/entity/party.entity';
import { Review } from '../review/entity/review.entity';
import { User } from '../user/entity/user.entity';
import { WishList } from '../user/entity/wish-list.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, Review, WishList, Party, Tag]), AuthModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}
