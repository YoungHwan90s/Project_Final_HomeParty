import { IsString } from 'class-validator';

export class AuthenticateCodeDto {
    @IsString()
    readonly email: string;

    @IsString()
    readonly userAuthenticationCode: string;
}
