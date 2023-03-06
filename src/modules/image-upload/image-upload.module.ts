import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thumbnail } from '../party/entity/thumbnail.entity';
import { ImageUploadController } from './image-upload.controller';
import { ImageUploadService } from './image-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Thumbnail])],
  controllers: [ImageUploadController],
  providers: [ImageUploadService]

})
export class imageUploadModule {}
