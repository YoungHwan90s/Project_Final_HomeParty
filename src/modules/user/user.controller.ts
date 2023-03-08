import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Param,
    UseGuards,
    Req,
    HttpCode,
    HttpException,
    Post,
    Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @HttpCode(200)
    async getUserInfo(@Req() req) {
        const user = req.user;
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/')
    @HttpCode(201)
    async updateUser(@Req() req, @Body() data: UpdateUserDto) {
        const user = req.user;
        return await this.userService.updateUser(user, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/')
    @HttpCode(204)
    async deleteUser(@Req() req) {
        const { id } = req.user;
        return await this.userService.deleteUser(id);
    }

    @Post('/wish-list/:partyId')
    @HttpCode(200)
    async updateWishList(@Param('partyId') partyId: number, @Req() req) {
        // const { id: userId } = req.user
        const userId = 1;
        return await this.userService.updateWishList(userId, partyId);
    }


    @Get('/wish-list')
    @HttpCode(200)
    async wishList(@Res() res) {
        // const { id: userId } = req.user
        const userId = 1;
        const wishList = await this.userService.wishList(userId)

        return res.send({ wishList })
    }

    // @Delete('/wish-list/:partyId')
}
