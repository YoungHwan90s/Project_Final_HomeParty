import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/users')
    @HttpCode(200)
    async getUserAdmin(@Query('page') page: number) {
        return await this.adminService.getUsersAdmin(page);
    }

    @Get('/users/search')
    @HttpCode(200)
    async searchUserAdmin(
        @Query('page') page: number,
        @Query('name') name: string
        ) {     
        return await this.adminService.searchUserAdmin(page, name);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/users/:userId')
    @HttpCode(204)
    async deletedUserAdmin(@Res() res, @Param('userId') userId: number) {
        const deleteUser = await this.adminService.deletedUserAdmin(userId);
        return res.json({ removedId: deleteUser });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/review')
    @HttpCode(200)
    async getReviewAdmin(@Query('page') page: number) {
        return await this.adminService.getReviewAdmin(page);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/review/search')
    @HttpCode(200)
    async searchReviewAdmin(
        @Query('page') page: number,
        @Query('review') review: string
        ) { 
        return await this.adminService.searchReviewAdmin(page, review);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/review/:reviewId')
    @HttpCode(204)
    async deletedReviewAdmin(@Param('reviewId') reviewId: number) {
        return await this.adminService.deletedReviewAdmin(reviewId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/praties')
    @HttpCode(200)
    async getPartyAdmin(@Query('page') page: number) {
        return await this.adminService.getPartyAdmin(page);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/party/search')
    @HttpCode(200)
    async searchPartyAdmin(
        @Query('page') page: number,
        @Query('name') name: string
        ) {     
        return await this.adminService.searchPartyAdmin(page, name);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/parties/:partyId')
    @HttpCode(204)
    async deletedPartyAdmin(@Param('partyId') partyId: number) {
        return await this.adminService.deletedPartyAdmin(partyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('tags')
    @HttpCode(200)
    async readtag(@Query('page') page: number) {
        return this.adminService.readtag(page);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/tag/search')
    @HttpCode(200)
    async searchTagAdmin(
        @Query('page') page: number,
        @Query('name') name: string
        ) {     
        return await this.adminService.searchTagAdmin(page, name);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/tag/:tagId')
    @HttpCode(204)
    async deletetag(@Param('tagId') tagId: number) {
        return await this.adminService.deletetag(tagId);
    }
}
