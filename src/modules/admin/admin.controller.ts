import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

@Get('reviews')
async getAllReviews() {
    return await this.adminService.getAllReviews();
}
}
