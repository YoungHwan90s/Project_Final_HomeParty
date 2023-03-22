import { IsString } from 'class-validator';

export class FindEmailDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly phone: string;
}