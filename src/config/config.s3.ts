import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

export const multerOptionsFactory = (configService: ConfigService): MulterOptions => {
    const s3 = new S3Client({
        region: configService.get('AWS_BUCKET_REGION'),
        credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        },
    });

    return {
        storage: multerS3({
            s3,
            bucket: configService.get('AWS_BUCKET_NAME'),
            key(_req, file, done) {
                // 파일의 확장자 추출
                const ext = path.extname(file.originalname); 
                // 한글 파일명 issue: 프론트 파일명 endcode -> 서버 파일명 decode
                const originalName = decodeURIComponent(file.originalname);
                // 파일이름_날짜.확장자 형식
                done(null, `${originalName}_${Date.now()}${ext}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    };
};