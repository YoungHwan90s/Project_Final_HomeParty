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
import { Tag } from './entity/tag.entity';
import { PartyService } from './party.service';
import { CacheService } from 'src/util/cache/cache.service';

@Controller('/api/party')
export class PartyController {
    constructor(
        private readonly partyService: PartyService,
        private readonly cacheService: CacheService,
    ) {}

    @Get('/')
    @HttpCode(200)
    async searchParties(
        @Query('date') date: Date,
        @Query('address') address: string,
        @Query('title') title: string,
        @Res() res,
    ): Promise<Party[]> {
        const result = await this.partyService.searchParties(date, address, title);
        return res.json({ result });
    }

    @Get('/list')
    @HttpCode(200)
    async getParties(@Query('page') page: number): Promise<Party[]> {
        return await this.partyService.getParties(page);
    }

    @Get('/top-tags')
    @HttpCode(200)
    async getTopTags(): Promise<Tag[]> {
        return this.partyService.getTopTags();
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    @HttpCode(201)
    async createParty(@Req() req, @Body() partyInfo: CreatePartyDto): Promise<Party> {
        const user = req.user;
        return await this.partyService.createParty(user, partyInfo);
    }

    @Get('/:partyId')
    @HttpCode(200)
    async getPartyById(@Param('partyId') partyId: number): Promise<Party> {
        return await this.partyService.getPartyByIdWithRelations(partyId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':partyId')
    @HttpCode(200)
    async updateParty(@Param('partyId') partyId: number, @Body() data: UpdatePartyDto) {
        return await this.partyService.updateParty(partyId, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:partyId')
    @HttpCode(200)
    async deleteParty(@Req() req, @Param('partyId') partyId: number): Promise<Party> {
        const { id: userId } = req.user;
        return await this.partyService.deleteParty(userId, partyId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/apply/:partyId')
    @HttpCode(200)
    async applyParty(@Req() req, @Param('partyId') partyId: number): Promise<PartyMember> {
        const user = req.user;
        return await this.partyService.applyParty(user, partyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/apply/:partyId/members')
    @HttpCode(200)
    async getPartyMembers(@Param('partyId') partyId: number): Promise<PartyMember[]> {
        return await this.partyService.getPartyMembers(partyId);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Delete('/apply-cancel/:partyId')
    async cancelApply(@Req() req, @Param('partyId') partyId: number): Promise<DeleteResult> {
        const { id: userId } = req.user;
        return await this.partyService.cancelParty(userId, partyId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/apply/:partyId')
    @HttpCode(200)
    async acceptMember(
        @Param('partyId') partyId: number,
        @Body('userId') userId: number,
        @Body('status') status: string,
    ): Promise<PartyMember> {
        return await this.partyService.acceptMember(partyId, userId, status);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/status/:partyId')
    @HttpCode(200)
    async statusParty(@Req() req, @Param('partyId') partyId: number): Promise<Party> {
        const partyStatusUpdated = await this.partyService.statusParty(partyId);

        const cachedParty = await this.cacheService.get('parties');
        // 상태변경 시 - 파티가 캐싱 되어있다면 캐시 삭제
        if (cachedParty) {
            await this.cacheService.del('parties');
        }
        return partyStatusUpdated;
    }
}
