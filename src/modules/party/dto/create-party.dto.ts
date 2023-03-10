import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePartyDto {
    @IsString()
    readonly title: string;

    @IsString()
    readonly content: string;

    @IsNumber()
    readonly maxMember: number;

    @IsString()
    readonly region: string;

    @IsString()
    readonly address: string;

    @IsString()
    readonly date: string;
}
