import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';

@Injectable()
export class ReviewService {
    constructor(@InjectRepository(Review) private reviewRepository: Repository<Review>) {}

    async writeReview(userId: number, partyId: number, data: CreateReviewDto): Promise<Review> {
        const review = new Review();
        review.userId = userId;
        review.partyId = partyId;
        review.rating = data.rating;
        review.review = data.review;

        return await this.reviewRepository.save(review);
    }

    async readReview(partyId: number): Promise<Review[]> {
        const reviews = await this.reviewRepository.find({
            where: { partyId, deletedAt: null },
            order: { createdAt: 'DESC' },
        });

        if (!reviews || reviews.length === 0) {
            throw new BadRequestException('잘못된 요청입니다.');
        }
        return reviews;
    }

    async updateReview(reviewId: number, rating: string, review: string): Promise<UpdateResult> {
        return await this.reviewRepository.update(reviewId, { rating, review });
    }

    async deleteReview(id, reveiwId: number): Promise<DeleteResult> {
        const review = await this.reviewRepository.findOne({ where: { id: reveiwId } });
        if (!review) {
            throw new NotFoundException('리뷰가 없습니다.');
        }
        if (review.userId !== id) {
            throw new UnauthorizedException('회원 본인만 삭제할 수 있습니다.');
        }

        return await this.reviewRepository.softDelete(review.id);
    }
}
