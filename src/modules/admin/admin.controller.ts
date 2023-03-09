import { Body, Controller, Delete, Get, HttpCode, Param, Post, Req, Res } from '@nestjs/common';
import { ReviewService } from '../review/review.service';
import { UserService } from '../user/user.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly userService: UserService,
        private readonly reviewService: ReviewService
    ) {}

@Get('/users')
@HttpCode(200)
async getUserAdmin(@Res() res) {
    const users = await this.userService.getUsersAdmin()
    return res.json({users})
}

@Delete('/users/:id')
@HttpCode(204)
async deletedUserAdmin(@Res() res, @Param('id') id: number) {
    const deleteUser = await this.userService.deletedUserAdmin(id)
    return res.json({removedId:deleteUser})
}

// 리뷰조회
@Get('/review/:partyId')
@HttpCode(200)
async getReviewAdmin(@Param('partyId') partyId: number) {
    return await this.reviewService.getReviewAdmin(partyId)
}   

// 리뷰 삭제
@Delete('/review/:id')
@HttpCode(204)
async deleteReviewAdmin(@Param('id') reviewId: number) {
    return await this.reviewService.deleteReviewAdmin(reviewId)
}

// // 태그 추가
// @Post('/tag')

// // 태그 조회
// @Get('/tag')

// // 태그 삭제
// @Delete('/tag/:tagId')

}
