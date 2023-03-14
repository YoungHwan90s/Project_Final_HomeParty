import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    // // 리뷰 등록
    @UseGuards(JwtAuthGuard)
    @Post('/:partyId')
    @HttpCode(201)
    async write(@Req() req, @Param('partyId') partyId: number, @Body() data: CreateReviewDto) {
        const { id } = req.user;
        return await this.reviewService.writeReview(id, partyId, data);
    }
    // // 리뷰 조회
    // @UseGuards(JwtAuthGuard)
    @Get('/:partyId')
    @HttpCode(200)
    async readReview(@Param('partyId') partyId: number) {
        return await this.reviewService.readReview(partyId);
    }

    // // 리뷰 수정
    // @UseGuards(JwtAuthGuard)
    @Patch('/:reviewId')
    @HttpCode(201)
    async updateReview(@Param('reviewId') reviewId: number, @Body() data: UpdateReviewDto) {
        return await this.reviewService.updateReview(reviewId, data.rating, data.review);
    }

    // // 리뷰 삭제
    // @UseGuards(JwtAuthGuard)
    @Delete('/:reviewId')
    @HttpCode(204)
    async deleteReview(@Param('reviewId') reviewId: number) {
        return await this.reviewService.deleteReview(reviewId);
    }
}
