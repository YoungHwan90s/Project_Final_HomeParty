import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePartyDto {
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly content: string;

    @IsNumber()
    readonly maxMember: number;

    @IsOptional()
    @IsString()
    readonly address: string;

    @IsString()
    readonly date: Date;

    @IsArray()
    @IsString({ each: true })
    thumbnail: string[];

    @IsArray()
    @IsString({ each: true })
    tagName: string[];
}
