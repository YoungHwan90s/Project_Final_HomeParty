import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class DeleteUserDto extends PickType(CreateUserDto, [
  'password',
] as const) {}