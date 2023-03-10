import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/modules/review/entity/review.entity';
import { Admin, DeleteResult, Repository } from 'typeorm';
import { PartyTagMapping } from '../party/entity/party-tag-mapping.entity';
import { Tag } from '../party/entity/party-tag.entity';


@Injectable()
export class AdminService {
    constructor(
        // @InjectRepository(Review) private reviewRepository: Repository<Review>,
        @InjectRepository(Tag) private tagRepository:Repository<Tag>
    ) {}

    async readtag():Promise<Tag[]>{
        const tags = await this.tagRepository.find()
        return tags
    }

    async deletetag(tagid:number){
        return await this.tagRepository.softDelete(tagid)
    }
}
