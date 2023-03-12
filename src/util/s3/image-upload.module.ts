import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/config/config.s3';
import { ImageUploadController } from './image-upload.controller';
import { ImageUploadService } from './image-upload.service';

@Module({
    imports: [
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: multerOptionsFactory,
            inject: [ConfigService],
        }),
    ],
    controllers: [ImageUploadController],
    providers: [ImageUploadService],
})
export class ImageUploadModule {}