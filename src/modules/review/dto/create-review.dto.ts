import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  readonly userId: number;

  @IsNumber()
  readonly partyId: number;

  @IsNumber()
  readonly rating: number;

  @IsString()
  readonly review: string;
}