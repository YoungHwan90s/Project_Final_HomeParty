import { Module } from '@nestjs/common';
import { ImageUploadController } from './image-upload.controller';

@Module({
  controllers: [ImageUploadController],
})
export class imageUploadModule {}
