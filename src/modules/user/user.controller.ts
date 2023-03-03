import { Body, Controller, Delete, Get, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto} from './dto/update-user.dto'
import { DeleteUserDto} from './dto/delete-user.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Get('/') 

    // @Patch('/')

    // @Delete('/:userId')

    // @Get('/wish-list')

    // @Delete('/wish-list/:partyId')

}
