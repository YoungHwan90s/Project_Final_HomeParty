import { Body, Controller, Delete, Get, Patch, Param, UseGuards, Req, HttpCode, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto} from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @HttpCode(200)
    async getUserInfo(@Req() req) {
        try {
            const user = req.user
            return user
        } catch (error) {
            throw new HttpException(error.message, 403)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/')
    @HttpCode(201)
    async updateUser(@Req() req, @Body() data: UpdateUserDto) {
        try {
            const user = req.user
            return await this.userService.updateUser(user, data);
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/')
    @HttpCode(204)
    async deleteUser(@Req() req) {
        try {
            const { id } = req.user
            return await this.userService.deleteUser(id)
        } catch (error) {
            throw new HttpException(error.message, 400)
        }   
    }

    // @Get('/wish-list')

    // @Delete('/wish-list/:partyId')

}
