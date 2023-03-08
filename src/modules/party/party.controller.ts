import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { PartyService } from './party.service';

@Controller('api/party')
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
    @Post()
    async createParty(@Body() party) {
        return await this.partyService.createParty(party);
    }

    // 파티 수정
    @Patch(':partyId')
    async updateParty(@Param('partyId') partyId, @Body() party) {
        let userId = Number(12);
        return await this.partyService.updateParty(userId, partyId, party);
    }

    // // 파티 삭제
    // @Delete('/party/:partyId')
    // async deleteParty(@Param('partyId') partyId: number) {
    //     // return await this.partyService.deleteParty(partyId, data.password);
    // }
    // @Delete('/party/:partyId')
    // async deleteParty(@Param('partyId') partyId: number) {
    //     return await this.partyService.deleteParty(partyId, data.password);
    // }

    // // 파티 신청자 목록 조회
    // @Get('/:partyId/members')
    // async getPartyMembers(@Param('partyId') partyId: number) {
    //     return await this.partyService.getPartyMembers(partyId);
    // }

    // // 파티 신청 취소
    // @Delete('/party/apply-cancle/:partyId')


    // // 파티 승낙/ 거절
    // @Patch('/party/:partyId/members/:userId')
}