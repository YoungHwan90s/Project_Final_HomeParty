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
    Post,
    Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @HttpCode(200)
    async getUserInfo(@Req() req, @Res() res) {
        const user = req.user
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

    @Get('/wish-list')
    @HttpCode(200)
    async wishList(@Res() res) {
        // const { id: userId } = req.user
        const userId = 1;
        const wishList = await this.userService.wishList(userId);

        return res.send({ wishList });
    }

    @Post('/wish-list/:partyId')
    @HttpCode(204)
    async updateWishList(@Param('partyId') partyId: number, @Req() req) {
        // const { id: userId } = req.user
        const userId = 1;
        return await this.userService.updateWishList(userId, partyId);
    }

    @Delete('/wish-list/:id')
    @HttpCode(204)
    async deleteWishList(@Param('id') id: number) {
        return await this.userService.deleteWishList(id);
    }
}
