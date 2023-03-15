import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';

@Controller('file')
export class ImageUploadController {
    constructor(private readonly imageUploadService: ImageUploadService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files[]'))
    async uploadFiles(@UploadedFiles() files: Express.MulterS3.File[]): Promise<string[]> {
        const urls = [];

        for (const file of files) {
            const url = await this.imageUploadService.uploadFile(file);
            urls.push(url);
        }

        return urls;
    }
}
