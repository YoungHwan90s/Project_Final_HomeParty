import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

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

    @Type(() => Date)
    @IsDate()
    readonly date: Date;
    
    @IsOptional()
    @IsArray()
    thumbnail: [];

    @IsOptional()
    @IsArray()
    tagName: [];
}
