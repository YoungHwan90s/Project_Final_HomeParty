import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ImageUploadService {
  uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }
    console.log(file)
    
    return { filePath: file };
  }
}