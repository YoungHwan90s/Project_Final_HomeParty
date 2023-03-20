import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { PartyMember } from './entity/party-member.entity';
import { Party } from './entity/party.entity';
import { PartyService } from './party.service';

@Controller('/api/party')
export class PartyController {
    constructor(private readonly partyService: PartyService) {}

    // 파티 검색
    @Get('/')
    async searchParties(
        @Query('date') date: string,
        @Query('address') address: string,
        @Query('title') title: string,
        @Res() res,
    ) {
        console.log(123)
        const result = await this.partyService.searchParties(date, address, title)
        console.log(result)
        return res.send({result});
    }

    // 파티 목록 조회
    @Get('/list/')
    async getParties() {
        return await this.partyService.getParties();
    }

    //파티 상세 조회
    @Get('/:partyId')
    async getPartyById(@Param('partyId') partyId: number): Promise<Party> {
        return await this.partyService.getPartyByIdWithRelations(partyId);
    }

    // 파티 등록
    @UseGuards(JwtAuthGuard)
    @HttpCode(201)
    @Post('/')
    async createParty(@Req() req, @Body() partyInfo: CreatePartyDto): Promise<Party> {
        let user = req.user;
        return this.partyService.createParty(user, partyInfo);
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
    async applyParty(
        @Req() req,
        @Res() res,
        @Param('partyId') partyId: number,
    ): Promise<PartyMember> {
        const user = req.user;
        await this.partyService.applyParty(user, partyId);
        return res.send({});
    }

    // 파티 신청자 목록 조회
    @UseGuards(JwtAuthGuard)
    @Get('/apply/:partyId/members')
    async getPartyMembers(@Param('partyId') partyId: number): Promise<PartyMember[]> {
        return await this.partyService.getPartyMembers(partyId);
    }

    // 파티 신청 취소
    @UseGuards(JwtAuthGuard)
    @Delete('/apply-cancel/:partyId')
    async cancelApply(@Req() req, @Param('partyId') partyId: number): Promise<DeleteResult> {
        const { id: userId } = req.user;
        return await this.partyService.cancelParty(userId, partyId);
    }

    // 파티 승낙 / 거절
    @UseGuards(JwtAuthGuard)
    @Patch('/apply/:partyId')
    async acceptMember(
        @Param('partyId') partyId: number,
        @Body('userId') userId: number,
        @Body('status') status: string,
    ): Promise<PartyMember> {
        return await this.partyService.acceptMember(partyId, userId, status);
    }

    // 파티 삭제
    @UseGuards(JwtAuthGuard)
    @Delete('/:partyId')
    async deleteParty(@Req() req, @Param('partyId') partyId: number): Promise<Party> {
        const { id: userId } = req.user;
        return await this.partyService.deleteParty(userId, partyId);
    }
}
