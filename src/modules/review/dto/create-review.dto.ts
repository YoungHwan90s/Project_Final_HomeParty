import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {

  @IsNumber()
  readonly rating: number;

  @IsString()
  readonly review: string;
}