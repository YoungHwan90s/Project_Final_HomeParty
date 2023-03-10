import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: new AWS.Endpoint('https://kr.object.ncloudstorage.com'),
      region: 'kr-standard',
      credentials: {
        accessKeyId: process.env.S3_ACCESSKEY,
        secretAccessKey: process.env.S3_SECRETKEY,
      },
    });
  }

  setUpload(bucket: string) {
    const upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: bucket,
        acl: 'public-read-write',
        key: function (req, file, cb) {
          const extension = path.extname(file.originalname);
          cb(null, Date.now().toString() + extension);
        },
      }),
    }).single('file');

    return upload;
  }
}
