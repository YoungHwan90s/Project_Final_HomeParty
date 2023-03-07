import { IsNumber, IsString } from 'class-validator';

export class EmailAuthenticationDto {
    @IsString()
    readonly email: string;

    @IsNumber()
    readonly authenticationCdoe: number;
}
