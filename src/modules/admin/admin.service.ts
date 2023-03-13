import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../party/entity/tag.entity';


@Injectable()
export class AdminService {
    constructor(
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
