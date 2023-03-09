import { IsNumber, IsString } from 'class-validator';

export class CreateThumbnailDto {
    @IsString()
    readonly thumbnail: string[];

    @IsNumber()
    readonly partyId: number;
}
