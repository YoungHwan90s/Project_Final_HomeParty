import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from '../party/entity/party.entity';
import { User } from '../user/entity/user.entity';
import { Review } from './entity/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
    imports: [TypeOrmModule.forFeature([Review,Party,User])],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewModule {}
