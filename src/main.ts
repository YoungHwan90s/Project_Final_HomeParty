import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.use(cookieParser())
    app.useStaticAssets(join(__dirname, '../src/views', 'public'));
    app.setBaseViewsDir(join(__dirname, '../src', 'views'));
    app.setViewEngine('ejs');

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT')
    await app.listen(port);
}
bootstrap();
