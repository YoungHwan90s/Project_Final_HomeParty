import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class FindPasswordDTO extends PickType(CreateUserDto, ['name', 'email'] as const) {}
