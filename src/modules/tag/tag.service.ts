import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entity/tag.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
      ) {}
}
