import { Body, Controller, Delete, Get, HttpCode, Param, Post, Res } from '@nestjs/common';
import { Tag } from '../party/entity/party-tag.entity';
import { PartyService } from '../party/party.service';
import { UserService } from '../user/user.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly userService: UserService,
    ) {}

// 회원 정보 조회
@Get('/users')
@HttpCode(200)
async getUsers(@Res() res) {
    const users = await this.userService.getUsersAdmin()
    return res.json({users})
}

// 회원 삭제
@Delete('/users/:id')
@HttpCode(204)
async deletedUser(@Res() res, @Param('id') id: number) {
    const deleteUser = await this.userService.deletedUserAdmin(id)
    return res.json({removedId:deleteUser})
}

// // 리뷰조회
// @Get('/review')

// // 리뷰 삭제
// @Delete('/review/:reviewId')

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
