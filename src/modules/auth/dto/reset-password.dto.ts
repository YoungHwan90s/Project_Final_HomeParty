import { IsString } from 'class-validator';

export class ResetPasswordDTO {
    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly confirmPassword: string;
}
