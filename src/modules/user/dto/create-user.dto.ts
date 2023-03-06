import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {

  @IsString()
  readonly email: string;

  @IsString()
  password: string;

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
  readonly region: string;

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

