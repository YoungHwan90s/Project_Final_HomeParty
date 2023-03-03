import { Controller } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly partyService: ReviewService) {}

// // 리뷰 등록
// @Post('/:partyId')

// // 리뷰 조회
// @Get('/:partyId')

// // 리뷰 수정
// @Patch('/:reviewId')

// // 리뷰 삭제
// @Delete('/:reviewId')

}
