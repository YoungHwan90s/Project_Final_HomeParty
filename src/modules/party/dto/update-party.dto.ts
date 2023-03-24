import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePartyDto {
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

    @Type(() => Date)
    @IsDate()
    readonly date: Date;

    @IsOptional()
    @IsArray()
    addThumbnail: [];

    @IsOptional()
    @IsArray()
    removeThumbnail: [];

    @IsOptional()
    @IsArray()
    addTagName: [];

    @IsOptional()
    @IsArray()
    removeTagName: [];
}
