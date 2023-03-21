import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmConfigService } from './config/config.typeorm';
import { PartyModule } from './modules/party/party.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReviewModule } from './modules/review/review.module';
import { AdminModule } from './modules/admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from './config/config.redis';
import { CacheModule } from './util/cache/cache.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/config.jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './config/config.nodemailer';
import { ImageUploadModule } from './util/s3/image-upload.module';
import { ChatGateway } from './chat.gateway';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
            inject: [ConfigService],
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useClass: RedisConfigService,
            inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useClass: MailerConfigService,
            inject: [ConfigService],
        }),
        CacheModule,
        UserModule,
        PartyModule,
        AuthModule,
        PassportModule,
        ReviewModule,
        AdminModule,
        ImageUploadModule,
    ],
    controllers: [AppController],
    providers: [AppService, ChatGateway],
})
export class AppModule {}