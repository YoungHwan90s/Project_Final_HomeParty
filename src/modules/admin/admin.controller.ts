import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

// // 리뷰조회
// @Get('/review')

// // 리뷰 삭제
// @Delete('/review/:reviewId')

// // 태그 추가
// @Post('/tag')

// // 태그 조회
// @Get('/tag')

// // 태그 삭제
// @Delete('/tag/:tagId')

}
