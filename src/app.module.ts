import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyPageModule } from './myPage/myPage.module';
import { TypeOrmConfigService } from '../config/config.typeorm';
import { PartyModule } from './party/party.module';
import { AuthModule } from './auth/auth.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ApplylistModule } from './applyList/applyList.module';
import { ReveiwModule } from './review/reveiw.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    MyPageModule,
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