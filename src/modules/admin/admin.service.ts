import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../review/entity/reveiw.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
    ) {}
}
