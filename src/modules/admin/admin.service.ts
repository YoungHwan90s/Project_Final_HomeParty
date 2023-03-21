import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { Party } from '../party/entity/party.entity';
import { Tag } from '../party/entity/tag.entity';
import { Thumbnail } from '../party/entity/thumbnail.entity';
import { Review } from '../review/entity/review.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        @InjectRepository(Party) private partyRepository: Repository<Party>,
    ) {}

    async getUsersAdmin() {
        return await this.userRepository.find({ withDeleted: true });
    }

    async deletedUserAdmin(userId: number) {
        return await this.userRepository.softDelete(userId);
    }

    async readtag(): Promise<Tag[]> {
        const tags = await this.tagRepository.find();
        return tags;
    }

    async deletetag(tagid: number) {
        return await this.tagRepository.softDelete(tagid);
    }

    async getPartyAdmin(): Promise<Party[]> {
        return await this.partyRepository.find({
            relations: ['thumbnail'],
            order: { date: 'DESC' },
        });
    }

    async deletedPartyAdmin(partyId: number) {
        const party = await this.partyRepository.findOne({
            where: { id: partyId },
            relations: ['thumbnail', 'review', 'partyMember', 'wishList'],
        });

        return await this.partyRepository.softRemove(party);
    }

    async getReviewAdmin(): Promise<Review[]> {
        return await this.reviewRepository.find({
            relations: ['party', 'user'],
            order: { partyId: 'DESC' },
            withDeleted: true,
        });
    }

    async deletedReviewAdmin(reviewId: number) {
        return await this.reviewRepository.softDelete(reviewId);
       
    }

}
