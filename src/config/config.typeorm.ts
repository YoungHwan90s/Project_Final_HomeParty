import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Party } from 'src/modules/party/entity/party.entity';
import { Thumbnail } from 'src/modules/party/entity/thumbnail.entity';
import { Review } from 'src/modules/review/entity/reveiw.entity';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>("DATABASE_HOST"),
      port: this.configService.get<number>("DATABASE_PORT"),
      username: this.configService.get<string>("DATABASE_USERNAME"),
      password: this.configService.get<string>("DATABASE_PASSWORD"),
      database: this.configService.get<string>("DATABASE_NAME"),
      entities: [Party, Thumbnail, User, Review],
      synchronize: true,
    };
  }
}
