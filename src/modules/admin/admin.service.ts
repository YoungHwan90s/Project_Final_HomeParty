import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/modules/review/entity/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
    ) {}
}
