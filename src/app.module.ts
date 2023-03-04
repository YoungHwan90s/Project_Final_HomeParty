import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmConfigService } from './config/config.typeorm';
import { PartyModule } from './modules/party/party.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReveiwModule } from './modules/review/reveiw.module';
import { AdminModule } from './modules/admin/admin.module';
import { imageUploadModule } from './modules/image-upload/image-upload.module';
import { ImageUploadController } from './modules/image-upload/image-upload.controller';
import { TagModule } from './modules/tag/tag.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
            inject: [ConfigService],
        }),
        UserModule,
        PartyModule,
        AuthModule,
        ReveiwModule,
        AdminModule,
        imageUploadModule,
        TagModule,
    ],
    controllers: [AppController, ImageUploadController],
    providers: [AppService],
})
export class AppModule {}
