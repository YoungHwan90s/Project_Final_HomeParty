import { IsNumber } from 'class-validator';

export class ResetPasswordDTO {

  @IsNumber()
  readonly authenticationCdoe: number;
}