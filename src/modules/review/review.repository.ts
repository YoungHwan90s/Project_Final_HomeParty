import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./entity/review.entity";

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private dataSource: DataSource) {
    super(Review, dataSource.createEntityManager());
  }


  async getReviewByDesc() {
    const result = await this.createQueryBuilder()
      .select("reviews")
      .from(Review, "reviews")
      .orderBy("partyId", "DESC")
      .orderBy("reviews.createdAt", "DESC")
      .getMany();
    return result;
  }
}
