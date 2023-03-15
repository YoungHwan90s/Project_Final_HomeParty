import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePartyDto {
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
    readonly date: Date;

    @IsOptional()
    @IsArray()
    addThumbnail: [];

    @IsOptional()
    @IsArray()
    removeThumnail: [];

    @IsOptional()
    @IsArray()
    addTagName: [];

    @IsOptional()
    @IsArray()
    removeTagName: [];
}
