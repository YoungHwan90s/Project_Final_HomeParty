import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Review } from './entity/review.entity';

@Injectable()
export class ReviewService {
    constructor(@InjectRepository(Review) private reviewRepository: Repository<Review>) {}

    async writeReview(userId: number, partyId: number, data) {
        await this.reviewRepository.insert({
            userId,
            partyId,
            rating: data.rating,
            review: data.review,
        });
        return { statusCode: 201, message: '등록 되었습니다.' };
    }

    async readReview(partyId: number): Promise<any> {
        const reviews = await this.reviewRepository.find({
            where: { partyId, deletedAt: null },
            order: { createdAt: 'DESC' },
        });

        if (!reviews || reviews.length === 0) {
            throw new BadRequestException('잘못된 요청입니다.');
        }
        return reviews;
    }

    async updateReview(reviewId: number, rating: string, review: string) {
        const updatedReview = { rating, review };
        const result = await this.reviewRepository.update(reviewId, updatedReview);
    }

    async deleteReview(id: number): Promise<DeleteResult> {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review) {
            throw new NotFoundException('리뷰가 없습니다.');
        } else {
            return await this.reviewRepository.softDelete(review.id);
        }
    }

    async getReviewAdmin() {
        const reviews = await this.reviewRepository.find({
            relations: ['party', 'user'],
            order: { partyId: 'DESC' },
            withDeleted: true,
        });
        console.log(reviews);
        return reviews;
    }

    async deleteReviewAdmin(id: number) {
        return await this.reviewRepository.softDelete(id);
    }
}
