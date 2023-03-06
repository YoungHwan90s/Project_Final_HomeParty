import { Body, Controller, Delete, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto} from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getUserInfo(@Req() req): Promise<User> {
        const { id } = req.user
        return await this.userService.getUserById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/')
    async updateUser(@Req() req, @Body() data: UpdateUserDto): Promise<void> {
        const { id } = req. user
        return await this.userService.updateUser(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/')
    async deleteUser(@Req() req) {
        const { id } = req.user
        return await this.userService.deleteUser(id)
    }

    // @Get('/wish-list')

    // @Delete('/wish-list/:partyId')

}
