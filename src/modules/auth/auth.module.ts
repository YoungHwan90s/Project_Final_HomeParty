import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from '../user/entity/user.entity';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/config.jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CacheService } from '../../util/cache/cache.service';
import { MailModule } from '../../util/node-mailer/node-mailer.module';
import { UserService } from '../user/user.service';
import { WishList } from '../user/entity/wish-list.entity';
import { Party } from '../party/entity/party.entity';
import { PartyService } from '../party/party.service';
import { PartyMember } from '../party/entity/party-member.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, WishList, Party, PartyMember]),
        PassportModule.register({
            session: false,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        MailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, CacheService, UserService, PartyService],
    exports: [AuthService]
})
export class AuthModule {}
