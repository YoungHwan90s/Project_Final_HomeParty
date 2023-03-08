import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly partyService: ReviewService) {}

// // 리뷰 등록
// @UseGuards(JwtAuthGuard)
@Post('/:partyId')
async write(
    @Param('partyId') partyId: number,
    @Body() data:CreateReviewDto){
    return await this.partyService.writeReview(1, partyId, data)//1 => userid 변경해야됨 
}
// // 리뷰 조회
// @UseGuards(JwtAuthGuard)
@Get('/:partyId')
async readReview(@Param('partyId') partyId:number){  
    return await this.partyService.readReview(partyId)
}

// // 리뷰 수정
// @UseGuards(JwtAuthGuard)
@Patch('/:reviewId')
async updateReview(
    @Param('reviewId')reviewId: number,
    @Body() data: UpdateReviewDto){
        return await this.partyService.updateReview(
            reviewId,
            data.rating,
            data.review,
        )
    }

// // 리뷰 삭제
// @UseGuards(JwtAuthGuard)
@Delete('/:reviewId')
async deleteReview(
    @Param('reviewId')reviewId: number){
        return await this.partyService.deleteReview(reviewId)
    }

}