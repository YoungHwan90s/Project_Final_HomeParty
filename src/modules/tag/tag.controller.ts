import { Controller } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    // // 태그 조회
    // @Get('/')

    // // 태그 추가
    // @Post('/:partyId')

    // // 태그 삭제
    // @Delete('/:tagId')
    
}
