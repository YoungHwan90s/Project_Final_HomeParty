import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyPageController } from './myPage.controller';
import { MyPage } from './myPage.entity';
import { MyPageService } from './myPage.service';

@Module({
  // 서비스에 사용할 리포지토리를 imports에 명시 해준다!
  imports: [TypeOrmModule.forFeature([MyPage])],
  controllers: [MyPageController],
  providers: [MyPageService]
})
export class MyPageModule {}
