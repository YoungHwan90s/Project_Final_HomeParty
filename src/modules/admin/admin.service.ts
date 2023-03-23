import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Party } from '../party/entity/party.entity';
import { Tag } from '../party/entity/tag.entity';
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

    async getUsersAdmin(page: number) {
        const users = await this.userRepository.findAndCount({
            withDeleted: true,
            skip: (page - 1) * 5,
            take: 5,
        });

        const totalCount = users[1];
        // 총 페이지 수 : 한 페이지당 5개씩
        let totalPage = Math.ceil(totalCount / 5);

        // 화면에 보여줄 그룹 : 한 그룹당 5개 페이지
        let pageGroup = Math.ceil(page / 5);

        // 한 그룹의 마지막 페이지 번호
        let lastPage = pageGroup * 5;

        // 한 그룹의 첫 페이지 번호
        let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

        // 만약 마지막 페이지 번호가 총 페이지 수 보다 크다면
        if (lastPage > totalPage) {
            lastPage = totalPage;
        }

        return { users, totalCount, firstPage, lastPage, totalPage };
    }

    async searchUserAdmin(page: number, name: string){
        const searchUser = await this.userRepository.findAndCount({
            where: { name: ILike(`%${name}%`) },
            skip: (page - 1) * 5,
            take: 5,
        })  
        const totalCount = searchUser[1];
        // 총 페이지 수 : 한 페이지당 5개씩
        let totalPage = Math.ceil(totalCount / 5);

        // 화면에 보여줄 그룹 : 한 그룹당 5개 페이지
        let pageGroup = Math.ceil(page / 5);

        // 한 그룹의 마지막 페이지 번호
        let lastPage = pageGroup * 5;

        // 한 그룹의 첫 페이지 번호
        let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

        // 만약 마지막 페이지 번호가 총 페이지 수 보다 크다면
        if (lastPage > totalPage) {
            lastPage = totalPage;
        }

        return { searchUser, totalCount, firstPage, lastPage, totalPage };
    }

    async deletedUserAdmin(userId: number) {
        return await this.userRepository.softDelete(userId);
    }

    async readtag(page: number) {
        const tags = await this.tagRepository.findAndCount({
            skip: (page - 1) * 5,
            take: 5,
        });

        const totalCount = tags[1];
        // 총 페이지 수 : 한 페이지당 5개씩
        let totalPage = Math.ceil(totalCount / 5);

        // 화면에 보여줄 그룹 : 한 그룹당 5개 페이지
        let pageGroup = Math.ceil(page / 5);

        // 한 그룹의 마지막 페이지 번호
        let lastPage = pageGroup * 5;

        // 한 그룹의 첫 페이지 번호
        let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

        // 만약 마지막 페이지 번호가 총 페이지 수 보다 크다면
        if (lastPage > totalPage) {
            lastPage = totalPage;
        }

        return { tags, totalCount, firstPage, lastPage, totalPage };
    }

    async searchTagAdmin(page: number, name: string){
        const searchTag= await this.tagRepository.findAndCount({
            where: { tagName: ILike(`%${name}%`) },
            skip: (page - 1) * 5,
            take: 5,
        })  
        const totalCount = searchTag[1];
        // 총 페이지 수 : 한 페이지당 5개씩
        let totalPage = Math.ceil(totalCount / 5);

        // 화면에 보여줄 그룹 : 한 그룹당 5개 페이지
        let pageGroup = Math.ceil(page / 5);

        // 한 그룹의 마지막 페이지 번호
        let lastPage = pageGroup * 5;

        // 한 그룹의 첫 페이지 번호
        let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

        // 만약 마지막 페이지 번호가 총 페이지 수 보다 크다면
        if (lastPage > totalPage) {
            lastPage = totalPage;
        }

        return { searchTag, totalCount, firstPage, lastPage, totalPage };
    }


    async deletetag(tagid: number) {
        return await this.tagRepository.softDelete(tagid);
    }

    async getPartyAdmin(page: number) {
        const parties = await this.partyRepository.findAndCount({
            relations: ['thumbnail'],
            order: { date: 'DESC' },
            skip: (page - 1) * 5,
            take: 5,
        });

        const totalCount = parties[1];
        let totalPage = Math.ceil(totalCount / 5);
        let pageGroup = Math.ceil(page / 5);
        let lastPage = pageGroup * 5;
        let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

        if (lastPage > totalPage) {
            lastPage = totalPage;
        }

        return { parties, totalCount, firstPage, lastPage, totalPage };
    }

    async searchPartyAdmin(page: number, title: string){
        const searchParty= await this.partyRepository.findAndCount({
            where: { title: ILike(`%${title}%`) },
            skip: (page - 1) * 5,
            take: 5,
        })  
        const totalCount = searchParty[1];
        // 총 페이지 수 : 한 페이지당 5개씩
        let totalPage = Math.ceil(totalCount / 5);

        // 화면에 보여줄 그룹 : 한 그룹당 5개 페이지
        let pageGroup = Math.ceil(page / 5);

        // 한 그룹의 마지막 페이지 번호
        let lastPage = pageGroup * 5;

        // 한 그룹의 첫 페이지 번호
        let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

        // 만약 마지막 페이지 번호가 총 페이지 수 보다 크다면
        if (lastPage > totalPage) {
            lastPage = totalPage;
        }

        return { searchParty, totalCount, firstPage, lastPage, totalPage };
    }


    async deletedPartyAdmin(partyId: number) {
        const party = await this.partyRepository.findOne({
            where: { id: partyId },
            relations: ['thumbnail', 'review', 'partyMember', 'wishList'],
        });

        return await this.partyRepository.softRemove(party);
    }

    async getReviewAdmin(page: number) {
        const reviews = await this.reviewRepository.findAndCount({
            relations: ['party', 'user'],
            order: { partyId: 'DESC' },
            withDeleted: true,
            skip: (page - 1) * 5,
            take: 5,
        });

        const totalCount = reviews[1];
        let totalPage = Math.ceil(totalCount / 5);
        let pageGroup = Math.ceil(page / 5);
        let lastPage = pageGroup * 5;
        let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

        if (lastPage > totalPage) {
            lastPage = totalPage;
        }

        return { reviews, totalCount, firstPage, lastPage, totalPage };
    }

    async searchReviewAdmin(page: number, review: string){
        const searchReview= await this.reviewRepository.findAndCount({
            where: { review: ILike(`%${review}%`) },
            relations: ['party', 'user'],
            skip: (page - 1) * 5,
            take: 5,
        })  
        const totalCount = searchReview[1];
        // 총 페이지 수 : 한 페이지당 5개씩
        let totalPage = Math.ceil(totalCount / 5);

        // 화면에 보여줄 그룹 : 한 그룹당 5개 페이지
        let pageGroup = Math.ceil(page / 5);

        // 한 그룹의 마지막 페이지 번호
        let lastPage = pageGroup * 5;

        // 한 그룹의 첫 페이지 번호
        let firstPage = lastPage - 5 + 1 <= 0 ? 1 : lastPage - 5 + 1;

        // 만약 마지막 페이지 번호가 총 페이지 수 보다 크다면
        if (lastPage > totalPage) {
            lastPage = totalPage;
        }

        return { searchReview, totalCount, firstPage, lastPage, totalPage };
    }

    async deletedReviewAdmin(reviewId: number) {
        return await this.reviewRepository.softDelete(reviewId);
    }
}
