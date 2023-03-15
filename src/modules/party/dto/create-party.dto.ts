import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePartyDto {
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly content: string;

    @IsNumber()
    readonly maxMember: string;

    @IsOptional()
    @IsString()
    readonly address: string;

    @IsString()
    readonly date: string;

    @IsOptional()
    @IsArray()
    thumbnail: [];

    @IsOptional()
    @IsArray()
    tagName: [];
}
