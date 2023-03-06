import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class FindEmailDto extends PickType(CreateUserDto, ['name', 'phone'] as const) {}

