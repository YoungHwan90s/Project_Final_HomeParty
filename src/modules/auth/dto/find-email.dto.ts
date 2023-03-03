import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class FindEmailDTO extends PickType(CreateUserDto, ['name', 'phone'] as const) {}

