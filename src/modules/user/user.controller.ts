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
    Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PartyService } from '../party/party.service';
import { PartialUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entity/user.entity';
import { PartyMember } from '../party/entity/party-member.entity';
import { WishList } from './entity/wish-list.entity';
import { UpdateResult } from 'typeorm';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly partyService: PartyService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    @HttpCode(200)
    async getUserInfo(@Req() req, @Res() res): Promise<User> {
        const user = req.user;
        return res.json({ user });
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/')
    @HttpCode(201)
    async updateUser(@Req() req, @Body() data: PartialUserDto): Promise<UpdateResult> {
        const user = req.user;
        return await this.userService.updateUser(user, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/')
    @HttpCode(204)
    async deleteUser(@Req() req): Promise<User[]> {
        const user = req.user;
        return await this.userService.deleteUser(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/check-password')
    @HttpCode(200)
    async checkPw(@Req() req, @Body() data: PartialUserDto): Promise<User> {
        const user = req.user;
        return this.userService.validateUser(user.email, data.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/wish-list')
    @HttpCode(200)
    async getWishList(@Req() req, @Res() res): Promise<WishList[]> {
        const { id } = req.user;
        const wishList = await this.userService.getWishList(id);

        return res.json({ wishList });
    }

    @UseGuards(JwtAuthGuard)
    @Post('/wish-list/:partyId')
    @HttpCode(200)
    async updateWishList(@Req() req, @Res() res, @Param('partyId') partyId: number): Promise<number> {
        const user = req.user;
        const updateOrDelete = await this.userService.updateWishList(user, partyId);

        return res.json({ updateOrDelete });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user-host')
    @HttpCode(200)
    async getUserHost(@Req() req): Promise<PartyMember[]> {
        const { id } = req.user;
        return await this.partyService.getUserHost(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/party-history')
    @HttpCode(200)
    async userPartyHistory(@Req() req): Promise<User> {
        const { id } = req.user;
        return await this.userService.userPartyHistory(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/party-applied')
    @HttpCode(200)
    async userApplyPartyList(@Req() req): Promise<User> {
        const { id } = req.user;
        return await this.userService.userApplyPartyList(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search-user-host')
    @HttpCode(200)
    async searchUserHostParties(
        @Query('date') date: Date,
        @Query('address') address: string,
        @Query('title') title: string,
        @Req() req,
        @Res() res,
    ): Promise<PartyMember[]> {
        const { id } = req.user
        const result = await this.partyService.searchUserHostParties(id, date, address, title);
        return res.json({ result });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search-party-applied')
    @HttpCode(200)
    async searchUserPartyApplied(
        @Query('date') date: Date,
        @Query('address') address: string,
        @Query('title') title: string,
        @Req() req,
        @Res() res,
    ): Promise<User[]> {
        const { id } = req.user
        const result = await this.userService.searchUserPartyApplied(id, date, address, title);
        return res.json({ result });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search-party-history')
    @HttpCode(200)
    async searchUserPartyHistory(
        @Query('date') date: Date,
        @Query('address') address: string,
        @Query('title') title: string,
        @Req() req,
        @Res() res,
    ): Promise<User[]> {
        const { id } = req.user
        const result = await this.userService.searchUserPartyHistory(id, date, address, title);
        return res.json({ result });
    }

}
