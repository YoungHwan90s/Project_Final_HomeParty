import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ImageUploadService {
    async uploadFile(files: Express.MulterS3.File) {
        if (!files) {
            throw new BadRequestException('파일 업로드에 실패하였습니다.');
        }
        return { filePath: files };
    }
}
