import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
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
    async getUserAdmin(@Res() res) {
        const users = await this.adminService.getUsersAdmin();
        return res.json({ users });
    }

    @UseGuards(JwtAuthGuard)
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
    async getReviewAdmin() {
        return await this.adminService.getReviewAdmin();
    }

    // // 태그 추가
    // @Post('/tag')

    // // 태그 조회
    @Get('tags')
    @HttpCode(200)
    async readtag() {
        return this.adminService.readtag();
    }

    // 태그 삭제
    @Delete('/tag/:tagId')
    async deletetag(@Param('tagId') tagId: number) {
        return await this.adminService.deletetag(tagId);
    }
}
