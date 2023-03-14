import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Party } from '../party/entity/party.entity';
import { Review } from './entity/review.entity';


@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        @InjectRepository(Party) private partyRepository: Repository<Party>) {}
    
    async writeReview( id,partyId: number, data) {
        await this.reviewRepository.insert({
            id ,
            partyId,
            rating: data.rating,
            review: data.review,
        });
        return { statusCode: 201, message: '등록 되었습니다.' };
    }

    async readReview(hostId: number) :Promise<any>{        
        const reviewInfo = await this.partyRepository.find({
            where: { hostId , deletedAt: null },
            order: { createdAt: 'DESC' },
            relations:['review','review.user']
        });
        
        if (!reviewInfo) {
            throw new NotFoundException("리뷰가 없습니다.");
        }        
        return reviewInfo;
    }

    async updateReview(reviewId: number, rating: string, review: string) {
        const updatedReview = { rating, review }; 
        const result = await this.reviewRepository.update(reviewId, updatedReview);
    }

    async deleteReview(id: number):Promise<DeleteResult> {
        const review = await this.reviewRepository.findOne({where: { id }});
        if (!review) {
            throw new NotFoundException("리뷰가 없습니다.")
        } else {
            return await this.reviewRepository.softDelete(review.id);
        }
    }

    async getReviewAdmin() {
      const reviews = await this.reviewRepository.find({
          relations: [ 'party', 'user' ],
          order: { partyId: "DESC" },
          withDeleted: true,
      });
      console.log(reviews)
      return reviews;
    }

    async deleteReviewAdmin(id: number) {
      return await this.reviewRepository.softDelete(id)
    }
  }