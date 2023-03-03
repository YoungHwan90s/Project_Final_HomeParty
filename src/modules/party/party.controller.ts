import { Controller } from '@nestjs/common';
import { PartyService } from './party.service';

@Controller('party')
export class PartyController {
    constructor(private readonly partyService: PartyService) {}

}
