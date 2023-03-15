import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {

  @IsString()
  readonly rating: string;

  @IsString()
  readonly review: string;
}