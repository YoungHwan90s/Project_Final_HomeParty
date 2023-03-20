import { IsString } from 'class-validator';

export class CheckPasswordDto {
    @IsString()
    readonly password: string;
}