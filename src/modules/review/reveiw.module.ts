import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/reveiw.entity';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewController],
  providers: [ReviewService,ReviewRepository]  // 리뷰 최신순으로 가져오기 위해, 커스텀 리포지터리 만들어서 주입할 것
})
export class ReveiwModule {}
