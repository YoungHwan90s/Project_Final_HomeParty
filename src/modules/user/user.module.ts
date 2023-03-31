import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { WishList } from './entity/wish-list.entity';
import { AuthModule } from '../auth/auth.module';
import { PartyService } from '../party/party.service';
import { Party } from '../party/entity/party.entity';
import { PartyMember } from '../party/entity/party-member.entity';
import { Kakao } from './entity/kakao.entitiy';
import { CacheService } from 'src/util/cache/cache.service';
import { Tag } from '../party/entity/tag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, WishList, Party, PartyMember, Kakao, Tag]), AuthModule],
    controllers: [UserController],
    providers: [UserService, PartyService, CacheService],
    exports: [UserService],
})
export class UserModule {}
