import {
    ConsoleLogger,
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

    // @UseGuards(JwtAuthGuard)
    @Get('/users')
    @HttpCode(200)
    async getUserAdmin(@Query('page') page: number) {
        return await this.adminService.getUsersAdmin(page);
    }

    // @UseGuards(JwtAuthGuard)
    @Delete('/users/:userId')
    @HttpCode(204)
    async deletedUserAdmin(@Res() res, @Param('userId') userId: number) {
        const deleteUser = await this.adminService.deletedUserAdmin(userId);
        return res.json({ removedId: deleteUser });
    }

    // 리뷰 조회
    // @UseGuards(JwtAuthGuard)
    @Get('/review')
    @HttpCode(200)
    async getReviewAdmin(@Query('page') page: number) {
        return await this.adminService.getReviewAdmin(page);
    }
    // 리뷰 삭제
    @Delete('/review/:reviewId')
    @HttpCode(204)
    async deletedReviewAdmin(@Param('reviewId') reviewId: number) {
        return await this.adminService.deletedReviewAdmin(reviewId);
    }

    // // 파티 조회
    @Get('/praties')
    @HttpCode(200)
    async getPartyAdmin(@Query('page') page: number) {
        return await this.adminService.getPartyAdmin(page);
    }

    // 파티 삭제
    @Delete('/parties/:partyId')
    @HttpCode(204)
    async deletedPartyAdmin(@Param('partyId') partyId: number) {
        return await this.adminService.deletedPartyAdmin(partyId);
    }

    // // 태그 조회
    @Get('tags')
    @HttpCode(200)
    async readtag(@Query('page') page: number) {
        return this.adminService.readtag(page);
    }

    // 태그 삭제
    @Delete('/tag/:tagId')
    @HttpCode(204)
    async deletetag(@Param('tagId') tagId: number) {
        return await this.adminService.deletetag(tagId);
    }
}
