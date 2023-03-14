import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePartyDto {
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly content: string;

    @Type(() => Number)
    @IsNumber()
    readonly maxMember: number;

    @IsOptional()
    @IsString()
    readonly address: string;

    @IsString()
    readonly date: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    thumbnail: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tagName: string[];
}
