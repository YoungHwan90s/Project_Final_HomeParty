import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entity/reveiw.entity';

@Injectable()
export class ReviewService {
  // 리뷰 최신순으로 가져오기 위해, 커스텀 리포지터리 만들어서 주입 헐 것
}
