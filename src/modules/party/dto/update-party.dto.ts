import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePartyDto {
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

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    addThumbnail: string[];

    @IsOptional()
    @IsArray()
    removeThumnail: number[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    addTagName: string[];

    @IsOptional()
    @IsArray()
    removeTagName: number[];
}
