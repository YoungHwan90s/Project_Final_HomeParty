import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';

import { PartyService } from './party.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

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
    async createParty(@Body() party: CreatePartyDto) {
        return await this.partyService.createParty(party);
    }

    // 파티 수정
    @Patch(':partyId')
    async updateParty(@Param('partyId') partyId: number, @Body() party: UpdatePartyDto) {
        const userId = 1;
        await this.partyService.updateParty(userId, partyId, party);
        return { success: true };
    }

    // // 파티 삭제
    // @Delete(':partyId')

    // 파티 신청
    @Post('apply/:partyId')
    async applyParty(@Param('partyId') partyId: number) {
        let userId = Number(1);
        return await this.partyService.applyParty(partyId, userId);
    }

    // 파티 신청자 목록 조회
    @Get('/:partyId/members')
    async getPartyMembers(@Param('partyId') partyId: number) {
        return await this.partyService.getPartyMembers(partyId);
    }

    // // 파티 신청 취소
    // @Delete('/party/apply-cancle/:partyId')

    // // 파티 승낙/ 거절
    // @Patch('/party/:partyId/members/:userId')
}
