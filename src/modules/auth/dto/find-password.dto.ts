import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class FindPasswordDto extends PickType(CreateUserDto, ['email'] as const) {}
