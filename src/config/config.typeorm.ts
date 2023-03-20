import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { PartyMember } from 'src/modules/party/entity/party-member.entity';
import { Party } from 'src/modules/party/entity/party.entity';
import { Thumbnail } from 'src/modules/party/entity/thumbnail.entity';
import { Review } from 'src/modules/review/entity/review.entity';
import { Tag } from 'src/modules/party/entity/tag.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { WishList } from 'src/modules/user/entity/wish-list.entity';
import { Kakao } from 'src/modules/user/entity/kakao.entitiy';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('DATABASE_HOST'),
            port: this.configService.get<number>('DATABASE_PORT'),
            username: this.configService.get<string>('DATABASE_USERNAME'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            database: this.configService.get<string>('DATABASE_NAME'),
            entities: [Party, PartyMember, Tag, Thumbnail, User, WishList, Review, Kakao],
            synchronize: true,
        };
    }
}
