import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reveiw.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewController],
  providers: [ReviewService] // 리뷰 최신순으로 불러오는 함수가 없으니까, 커스텀리포지터리 만들고 추가
})
export class ReveiwModule {}
