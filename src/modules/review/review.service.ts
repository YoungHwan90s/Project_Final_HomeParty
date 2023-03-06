import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Review } from './entity/reveiw.entity';
import { ReviewRepository } from './review.repository';


@Injectable()
export class ReviewService {
  // 리뷰 최신순으로 가져오기 위해, 커스텀 리포지터리 만들어서 주입 헐 것
  constructor(
  @InjectRepository(Review) private reviewRepository: ReviewRepository
  ) {}
  async writeReview(userId: number, partyId: number, rating: number, review: string) {
    try {
      if (typeof userId !== "number" || typeof partyId !== "number" || typeof rating !== "number" || typeof review !== "string") {
        throw new Error("입력한 데이터의 형식이 올바르지 않습니다.");
      }
  
      await this.reviewRepository.insert({
        userId,
        partyId,
        rating,
        review,
      });
    
      return { statusCode: 201, message: "등록 되었습니다." };
    } catch (error) {
      console.error(error);
      return { statusCode: 500, message: "서버 오류가 발생했습니다." };
    }
  }
  // async writeReview(userId: number, partyId: number, rating: number, review: string) {      
  //   await this.reviewRepository.insert({
  //     userId,
  //     partyId,
  //     rating,
  //     review,
  //   });
  
  //   return { statusCode: 201, message: "등록 되었습니다." };;
  // }

  async readReview(partyId: number) {
    const reviews = await this.reviewRepository.find({
      where: { partyId, deletedAt: null },
      select: ["userId", "partyId", "rating", "review", "createdAt", "updatedAt"],
      order: { createdAt: "DESC" }
    });
  
    if (!reviews || reviews.length === 0) {
      throw new Error('잘못된 요청입니다.');
    }
  
    return reviews;
  }

  async updateReview(reviewId: number, rating: number, review: string) {
        const updatedReview = { rating, review };
    const result = await this.reviewRepository.update(reviewId, updatedReview);
    if (result.affected === 1) {
      return { statusCode: 201, message: "수정 되었습니다." };
    } else {
      return { statusCode: 204, message: "수정 되었습니다." };
    }
  }

  async deleteReview(id: number){
    const deleted = await this.reviewRepository.findOne({
      where : {id},
      select: ["id"]
    });
    if(!deleted){
      return{statusCode:400 , message : "잘못된 요청입니다."}
    }else{
      await this.reviewRepository.softDelete(id)
      return{statusCode:200 , message : "삭제 되었습니다."}
    }
   
  }

}