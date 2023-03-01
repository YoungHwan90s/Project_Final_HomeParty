import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from 'src/myPage/myPage.entity'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  // 생성자를 통해서 DI
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>("DATABASE_HOST"),
      port: this.configService.get<number>("DATABASE_PORT"),
      username: this.configService.get<string>("DATABASE_USERNAME"),
      password: this.configService.get<string>("DATABASE_PASSWORD"),
      database: this.configService.get<string>("DATABASE_NAME"),
      entities: [User],
      socketPath: '/tmp/mysql.sock',
      synchronize: true, // 개발버전에서는 스키마의 용이한 수정을 위해서
    };
  }
}
