import { Body, Controller, Delete, Get, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Get('/')
    // async abc() {
    //     return await this.userService.abc();
    //   }

    // @Patch('/')
    // async def() {
    //     return await this.userService.def();
    //   }

    // @Delete('/:userId')
    // async ghi() {
    //     return await this.userService.ghi();
    //   }
}
