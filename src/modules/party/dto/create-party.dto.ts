import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePartyDto {
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly content: string;

    @IsString()
    readonly maxMember: string;

    @IsOptional()
    @IsString()
    readonly address: string;

    @IsString()
    readonly date: string;

    @IsOptional()
    @IsArray()
    // @IsString({ each: true })
    thumbnail: [];

    @IsOptional()
    @IsArray()
    // @IsString({ each: true })
    tagName: [];
}
