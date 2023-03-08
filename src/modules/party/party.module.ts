import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyMember } from './entity/party-member.entity';
// import { PartyController } from './party.controller';
import { Party } from './entity/party.entity';
// import { PartyService } from './party.service';
import { Thumbnail } from './entity/thumbnail.entity';
import { PartyTagMapping } from './entity/party-tag-mapping.entity';
import { AuthModule } from '../auth/auth.module';

// @Module({
//   imports: [
//           TypeOrmModule.forFeature([Party, Thumbnail, PartyMember, PartyTagMapping]),
//           AuthModule
//         ],
//   controllers: [PartyController],
//   providers: [PartyService]
// })
// export class PartyModule {}
