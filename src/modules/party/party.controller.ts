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
        return res.send({ result });
    }

    @Get('/list')
    @HttpCode(200)
    async getParties(@Query('page') page: number): Promise<Party[]> {
        let parties: Party[];

        if (page === 1) {
            const cachedParties = await this.cacheService.get('parties');
            if (cachedParties) {
                parties = JSON.parse(cachedParties);
            } else {
                parties = await this.partyService.getParties(page);
                const stringifyParties = JSON.stringify(parties);
                // 파티 캐시 처리 (페이지=1)
                await this.cacheService.set('parties', stringifyParties);
            }
        } else {
            parties = await this.partyService.getParties(page);
        }

        return parties;
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
        const newParty = await this.partyService.createParty(user, partyInfo);
        // 새로 추가 시 - 파티 캐시 삭제
        await this.cacheService.del('parties');

        return newParty;
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
        const updatedParty = await this.partyService.updateParty(partyId, data);
       
        const cachedParty = await this.cacheService.get('parties');
        if (cachedParty) {
            const parseCachedParty = JSON.parse(cachedParty);
            const isItCachedParty = parseCachedParty.find((party) => party.id === updatedParty.id);

            // 업데이트 시 - 파티가 캐싱 되어있다면 캐시 삭제
            if (isItCachedParty) {
                await this.cacheService.del('parties');
            }
        }

        return updatedParty;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:partyId')
    @HttpCode(200)
    async deleteParty(@Req() req, @Param('partyId') partyId: number): Promise<Party> {
        const { id: userId } = req.user;

        const deletedParty = await this.partyService.deleteParty(userId, partyId);

        const cachedParty = await this.cacheService.get('parties');
        const parseCachedParty = JSON.parse(cachedParty);

        const isItCachedParty = parseCachedParty.find((party) => party.id === deletedParty.id);

        // 삭제 시 - 파티가 캐싱 되어있다면 캐시 삭제
        if (isItCachedParty) {
            await this.cacheService.del('parties');
        }

        return deletedParty;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/apply/:partyId')
    @HttpCode(200)
    async applyParty(
        @Req() req,
        @Res() res,
        @Param('partyId') partyId: number,
    ): Promise<PartyMember> {
        const user = req.user;
        await this.partyService.applyParty(user, partyId);
        return res.send({});
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
    async statusParty(@Req() req, @Param('partyId') partyId: number) {
        const { id: userId } = req.user;
        return await this.partyService.statusParty(userId, partyId);
    }
}
