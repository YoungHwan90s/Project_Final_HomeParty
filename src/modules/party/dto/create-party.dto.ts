import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePartyDto {
    @IsNumber()
    readonly hostId: number;

    @IsString()
    readonly title: string;

    @IsString()
    readonly content: string;

    @IsNumber()
    readonly maxMember: number;

    @IsOptional()
    @IsNumber()
    readonly currMember: number;

    @IsString()
    readonly region: string;

    @IsString()
    readonly address: string;

    @IsString()
    readonly date: string;

    @IsOptional()
    @IsString()
    readonly status: string;
}
