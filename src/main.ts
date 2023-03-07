import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // DTO 유효성 검사를 위해 주입
    
    app.use(cookieParser())

    app.useStaticAssets(join(__dirname, '../src/public', 'public'));
    app.setBaseViewsDir(join(__dirname, '../src', 'views'));
    app.setViewEngine('ejs');

    await app.listen(4000);
}
bootstrap();
