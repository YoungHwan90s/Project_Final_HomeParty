import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmConfigService } from './config/config.typeorm';
// import { PartyModule } from './modules/party/party.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReveiwModule } from './modules/review/reveiw.module';
import { AdminModule } from './modules/admin/admin.module';
import { imageUploadModule } from './modules/image-upload/image-upload.module';
import { TagModule } from './modules/tag/tag.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from './config/config.redis';
import { CacheModule } from './modules/cache/cache.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/config.jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './config/config.nodemailer';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
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
        // PartyModule,
        AuthModule,
        PassportModule,
        ReveiwModule,
        AdminModule,
        imageUploadModule,
        TagModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
