import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../party/entity/tag.entity';
import { Review } from '../review/entity/review.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Tag) private tagRepository:Repository<Tag>,
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
    ) {}

      async getUsersAdmin() {
        return await this.userRepository.find({ withDeleted: true });
    }

    async deletedUserAdmin(userId: number) {
        return await this.userRepository.softDelete(userId);
    }

    async readtag():Promise<Tag[]>{
        const tags = await this.tagRepository.find()
        return tags
    }

    async deletetag(tagid:number){
        return await this.tagRepository.softDelete(tagid)
    }

    async getReviewAdmin(): Promise<Review[]> {
        return await this.reviewRepository.find({
            relations: ['party', 'user'],
            order: { partyId: 'DESC' },
            withDeleted: true,
        });
    }
}
