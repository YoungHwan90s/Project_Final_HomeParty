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
import { CheckPasswordDto } from './dto/check-password.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @HttpCode(200)
    async getUserInfo(@Req() req, @Res() res) {
        const user = req.user;
        return res.json({ user });
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/')
    @HttpCode(201)
    async updateUser(@Req() req, @Res() res, @Body() data: UpdateUserDto) {
        const user = req.user;
        await this.userService.updateUser(user, data);
        return res.json({});
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/')
    @HttpCode(204)
    async deleteUser(@Req() req, @Res() res) {
        const { id } = req.user;
        await this.userService.deleteUser(id);
        return await res.json({});
    }

    @UseGuards(JwtAuthGuard)
    @Post('/check-password')
    @HttpCode(200)
    async checkPw(@Req() req, @Body() data:CheckPasswordDto) {
        const user = req.user;
        return this.userService.validateUser(user.email, data.password)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/wish-list')
    @HttpCode(200)
    async getWishList(@Req() req, @Res() res) {
        const { id } = req.user;
        const wishList = await this.userService.getWishList(id);

        return res.json({ wishList });
    }

    @UseGuards(JwtAuthGuard)
    @Post('/wish-list/:partyId')
    @HttpCode(200)
    async updateWishList(@Req() req, @Res() res, @Param('partyId') partyId: number) {
        const user = req.user;
        const updateOrDelete = await this.userService.updateWishList(user, partyId);
        return res.json({ updateOrDelete });
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/history')
    @HttpCode(200)
    async userHistory(@Req() req) {
        // const { id } = req.user;
        const history = await this.userService.userHistory(5);

        return history;
    }
}
