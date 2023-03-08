import { Body, Controller, Delete, Get, Patch, Param, UseGuards, Req, HttpCode, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto} from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @UseGuards(JwtAuthGuard)
    @Get('/')
    @HttpCode(200)
    async getUserInfo(@Req() req, @Res() res) {
        // const user = req.user
        const id = 9
        const user = await this.userService.getUserById(id)
        return res.json({user})
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/')
    @HttpCode(201)
    async updateUser(@Req() req, @Res() res, @Body() data: UpdateUserDto) {
        const user = req.user
        await this.userService.updateUser(user, data);
        return res.json({})
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/')
    @HttpCode(204)
    async deleteUser(@Req() req, @Res() res) {
        const { id } = req.user
        await this.userService.deleteUser(id)
        return res.json({})
    }

    // @Get('/wish-list')

    // @Delete('/wish-list/:partyId')

}
