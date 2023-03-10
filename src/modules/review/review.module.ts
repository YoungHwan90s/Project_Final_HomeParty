import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Review } from './entity/review.entity';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

@Module({
    imports: [TypeOrmModule.forFeature([Review]), AuthModule],
    controllers: [ReviewController],
    providers: [ReviewService, ReviewRepository], // 리뷰 최신순으로 가져오기 위해, 커스텀 리포지터리 만들어서 주입할 것
})
export class ReviewModule {}
