import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {

  @IsOptional()
  @IsNumber()
  readonly kakaologinId: number;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly confirmPassword: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly sex: string;

  @IsString()
  readonly phone: number;

  @IsOptional()
  @IsString()
  readonly birthday: string;

  @IsOptional()
  @IsString()
  readonly rigion: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsString()
  readonly profile: string;

  @IsOptional()
  @IsString()
  readonly introduction: string;

}

