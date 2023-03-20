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

@Module({
    imports: [TypeOrmModule.forFeature([User, WishList, Party, PartyMember, Kakao]), AuthModule],
    controllers: [UserController],
    providers: [UserService, PartyService],
    exports: [UserService],
})
export class UserModule {}
