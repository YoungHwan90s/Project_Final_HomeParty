import { Body, Controller, Delete, Get, HttpCode, Param, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Tag } from '../party/entity/tag.entity';
import { PartyService } from '../party/party.service';
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

@UseGuards(JwtAuthGuard)
@Get('/users')
@HttpCode(200)
async getUserAdmin(@Res() res) {
    const users = await this.userService.getUsersAdmin()
    return res.json({users})
}

@UseGuards(JwtAuthGuard)
@Delete('/users/:userId')
@HttpCode(204)
async deletedUserAdmin(@Res() res, @Param('userId') userId: number) {
    const deleteUser = await this.userService.deletedUserAdmin(userId)
    return res.json({removedId:deleteUser})
}

// 리뷰 조회
// @UseGuards(JwtAuthGuard)
@Get('/review')
@HttpCode(200)
async getReviewAdmin() {
    return await this.reviewService.getReviewAdmin()
}

// 리뷰 삭제
@Delete('/review/:reviewId')
@HttpCode(204)
async deleteReviewAdmin(@Param('reviewId') reviewId: number) {
    return await this.reviewService.deleteReviewAdmin(reviewId)
}

// // 태그 추가
// @Post('/tag')

// // 태그 조회
@Get('tags')
@HttpCode(200)
  async readtag() {
    return  this.adminService.readtag();
  }

  // 태그 삭제
  @Delete('/tag/:tagId')
    async deletetag(@Param('tagId')tagId:number){
      return await this.adminService.deletetag(tagId)
    }
}
