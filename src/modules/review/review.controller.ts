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
    Res,
    UseGuards,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entity/review.entity';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly userService: UserService,
    ) {}

    // // 리뷰 등록
    @UseGuards(JwtAuthGuard)
    @Post('/:partyId')
    @HttpCode(201)
    async write(
        @Req() req,
        @Param('partyId') partyId: number,
        @Body() data: CreateReviewDto,
    ): Promise<Review> {
        const { id } = req.user;
        return await this.reviewService.writeReview(id, partyId, data);
    }

    // // 리뷰 조회
    @Get('/:hostId')
    @HttpCode(200)
    async readReview(@Param('hostId') hostId: number): Promise<Review[]> {
        return await this.userService.readReview(hostId);
    }

    // // 리뷰 수정
    @UseGuards(JwtAuthGuard)
    @Patch('/:reviewId')
    @HttpCode(201)
    async updateReview(
        @Param('reviewId') reviewId: number,
        @Body() data: UpdateReviewDto,
    ): Promise<UpdateResult> {
        return await this.reviewService.updateReview(reviewId, data.rating, data.review);
    }

    // // 리뷰 삭제
    @UseGuards(JwtAuthGuard)
    @Delete('/:reviewId')
    @HttpCode(204)
    async deleteReview(@Param('reviewId') reviewId: number, @Req() req): Promise<DeleteResult> {
        const { id } = req.user;
        return await this.reviewService.deleteReview(id, reviewId);
    }
}
