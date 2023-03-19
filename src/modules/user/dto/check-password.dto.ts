import { IsString } from 'class-validator';

export class CheckPasswordDto {
    // static password(password: any, password1: any) {
    //     throw new Error('Method not implemented.');
    // }
    @IsString()
    readonly password: string;
}