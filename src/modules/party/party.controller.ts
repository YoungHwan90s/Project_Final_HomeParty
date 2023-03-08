import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
// import { PartyService } from './party.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

// @Controller('party')
// export class PartyController {
//     constructor(private readonly partyService: PartyService) {}

// // 파티 목록 조회
// @Get('/party-list')

// //파티 상세 조회
// @Get('/party/:partyId')

// // 파티 등록
// @Post('/party')

// // 파티 수정
// @Patch('/party/:partyId')

// // 파티 삭제
// @Delete('/party/:partyId')
// async deleteParty(@Param('partyId') partyId: number) {
//     return await this.partyService.deleteParty(partyId, data.password);
// }

// // 파티 신청
// @Post('/party/apply/:partyId')

// // 파티 신청 취소
// @Delete('/party/apply-cancle/:partyId')

// // 파티 신청자 목록 조회
// @Get('/party/:partyId/members')

// // 파티 승낙/ 거절
// @Patch('/party/:partyId/members/:userId')

// }
