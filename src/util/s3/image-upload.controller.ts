import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';

@Controller('file')
export class ImageUploadController {
    constructor(private readonly imageUploadService: ImageUploadService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files[]'))
    async uploadFiles(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 2000000 }),
                    // new FileTypeValidator({ fileType: 'image/jpeg' }),
                ],
            }),
        )
        files: Express.MulterS3.File[],
    ): Promise<string[]> {
        const urls = [];

        for (const file of files) {
            const url = await this.imageUploadService.uploadFile(file);
            urls.push(url);
        }

        return urls;
    }
}
