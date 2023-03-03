import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/modules/review/reveiw.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Review) private userRepository: Repository<Review>,
        ) {}

    async getAllReviews() {
    }
}
