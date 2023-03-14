import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  readonly userid: string;

  @IsString()
  readonly rating: string;

  @IsString()
  readonly review: string;
}