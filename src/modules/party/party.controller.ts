import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Party } from './entity/party.entity';
import { PartyService } from './party.service';

@Controller('/api/party')
export class PartyController {
    constructor(private readonly partyService: PartyService) {}

    // 파티 목록 조회
    @Get('/list')
    async getParties() {
        return await this.partyService.getParties();
    }

    //파티 상세 조회
    @Get(':partyId')
    async getPartyById(@Param('partyId') partyId: number) {
        return await this.partyService.getPartyById(partyId);
    }

    // 파티 등록
    // @Post()
    // async createParty(@Body() partyInfo: Party) {
    //     let userId = 1;
    //     return await this.partyService.createParty(userId, partyInfo);
    // }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createParty(@Req() req, @Body() partyInfo: Party) {
        // let userId = 1;
        const { id: userId } = req.user;
        return await this.partyService.createParty(userId, partyInfo);
    }

    // 파티 수정
    @Patch(':partyId')
    async updateParty(@Param('partyId') partyId, @Body() partyInfo) {
        let userId = Number(1);
        return await this.partyService.updateParty(userId, partyId, partyInfo);
    }

    // 파티 삭제
    @Delete('/:partyId')
    async deleteParty(@Param('partyId') partyId: number) {
        return await this.partyService.deleteParty(partyId);
    }

    // 파티 신청
    @UseGuards(JwtAuthGuard)
    @Post('/apply/:partyId')
    async applyParty(@Req() req, @Param('partyId') partyId: number) {
        const user = req.user;
        return await this.partyService.applyParty(user, partyId);
    }

    // 파티 신청자 목록 조회
    @Get('/apply/:partyId/members')
    async getPartyMembers(@Param('partyId') partyId: number) {
        return await this.partyService.getPartyMembers(partyId);
    }

    // 파티 신청 취소
    @Delete('/apply-cancel/:partyId')
    async cancelApply(@Param('partyId') partyId: number) {
        let userId = 2;
        return await this.partyService.cancelParty(partyId, userId);
    }

    // 파티 승낙
    @Patch('/apply/:partyId/members/:userId')
    async acceptMember(@Param('partyId') partyId: number, @Param('userId') userId: number) {
        return await this.partyService.acceptMember(partyId, userId);
    }
    // 파티 거절
    @Patch('/apply/:partyId/members/:userId')
    async rejectMember(@Param('partyId') partyId: number, @Param('userId') userId: number) {
        return await this.partyService.rejectMember(partyId, userId);
    }
}
