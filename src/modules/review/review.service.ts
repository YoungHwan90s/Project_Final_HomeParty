import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Party } from '../party/entity/party.entity';
import { User } from '../user/entity/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';


@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Party) private partyRepository: Repository<Party>) {}
    
        //트러블슈팅
    // async writeReview( id,partyId: number, data) {
    //     await this.reviewRepository.insert({
    //         id ,
    //         partyId,
    //         rating: data.rating,
    //         review: data.review,
    //     });
    //     return { statusCode: 201, message: '등록 되었습니다.' };
    // }

    async writeReview( userId:number,partyId: number, data: CreateReviewDto):Promise<Review> {
        const review = new Review()
        review.userId = userId
        review.partyId = partyId
        review.rating = data.rating
        review.review = data.review
      
        return await this.reviewRepository.save(review)
    }
    async readReview(hostId: number) :Promise<any>{        
        const reviewInfo = await this.userRepository.findOne({
            where: { id: hostId , deletedAt: null },
            relations:['party','party.thumbnail','party.review','party.review.user']
        });
        
        
        if (!reviewInfo) {
            throw new NotFoundException("리뷰가 없습니다.");
        }        
        return reviewInfo;
    }


    // async readReview(partyId: number) :Promise<any>{        
    //     const reviewInfo = await this.reviewRepository.find({
    //         where: { partyId , deletedAt: null },
    //         order: { createdAt: 'DESC' },
    //         relations:['party.user','user','party.thumbnail']
    //     });
        
        
    //     if (!reviewInfo) {
    //         throw new NotFoundException("리뷰가 없습니다.");
    //     }        
    //     return reviewInfo;
    // }
    // async readReview(hostId: number) :Promise<any>{        
    //     const reviewInfo = await this.partyRepository.find({
    //         where: { hostId , deletedAt: null },
    //         order: { createdAt: 'DESC' },
    //         relations:['review','review.user']
    //     });

    //     if (!reviewInfo) {
    //         throw new NotFoundException("리뷰가 없습니다.");
    //     }        
    //     return reviewInfo;
    // }

    async updateReview(reviewId: number, rating: string, review: string) {
        return await this.reviewRepository.update(reviewId, { rating, review });
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