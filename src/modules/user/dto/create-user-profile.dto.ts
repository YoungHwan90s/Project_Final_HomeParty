import { IsString } from 'class-validator';

export class CreateUserProfileDto {
    @IsString()
    readonly id: number;

    @IsString()
    readonly profile: string;

}