import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmConfigService } from './config/config.typeorm';
import { PartyModule } from './modules/party/party.module';
import { AuthModule } from './modules/auth/auth.module';
import { WishlistModule } from './modules/wish-list/wish-list.module';
import { ApplylistModule } from './modules/applyList/applyList.module';
import { ReveiwModule } from './modules/review/reveiw.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
            inject: [ConfigService],
        }),
        UserModule,
        PartyModule,
        AuthModule,
        WishlistModule,
        ApplylistModule,
        ReveiwModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
