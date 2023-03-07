import { IsString } from 'class-validator';

export class AuthenticateEmailDto {
    @IsString()
    readonly email: string;
}
