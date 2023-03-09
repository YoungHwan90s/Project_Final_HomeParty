import { IsNumber, IsString } from 'class-validator';

export class CreateTagDto {
    @IsString()
    readonly tagName: string[];

    @IsNumber()
    readonly partyId: number;
}
