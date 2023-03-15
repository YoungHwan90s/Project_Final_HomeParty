import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
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
    @UseGuards(JwtAuthGuard)
    @HttpCode(201)
    @Post('/')
    async createParty(@Req() req, @Body() partyInfo: CreatePartyDto) {
        let user = req.user;
        return await this.partyService.createParty(user, partyInfo);
    }

    // 파티 수정
    @UseGuards(JwtAuthGuard)
    @Patch(':partyId')
    async updateParty(@Param('partyId') partyId: number, @Body() data: UpdatePartyDto) {
        return await this.partyService.updateParty(partyId, data);
    }

    // 파티 신청
    @UseGuards(JwtAuthGuard)
    @Post('/apply/:partyId')
    async applyParty(@Req() req, @Res() res, @Param('partyId') partyId: number) {
        const user = req.user;
        await this.partyService.applyParty(user, partyId);
        return res.send({})
    }

    // 파티 신청자 목록 조회
    @UseGuards(JwtAuthGuard)
    @Get('/apply/:partyId/members')
    async getPartyMembers(@Param('partyId') partyId: number) {
        return await this.partyService.getPartyMembers(partyId);
    }

    // 파티 신청 취소
    @UseGuards(JwtAuthGuard)
    @Delete('/apply-cancel/:partyId')
    async cancelApply(@Req() req, @Param('partyId') partyId: number) {
        const { id: userId } = req.user;
        return await this.partyService.cancelParty(userId, partyId);
    }

    // 파티 승낙 / 거절
    @UseGuards(JwtAuthGuard)
    @Patch('/apply/:partyId/members/:userId')
    async acceptMember(
        @Param('userId') userId: number,
        @Param('partyId') partyId: number,
        @Body() status: string,
    ) {
        return await this.partyService.acceptMember(userId, partyId, status);
    }

    // 파티 삭제
    @UseGuards(JwtAuthGuard)
    @Delete('/:partyId')
    async deleteParty(@Req() req, @Param('partyId') partyId: number) {
        const { id: userId } = req.user;
        return await this.partyService.deleteParty(userId, partyId);
    }
}
