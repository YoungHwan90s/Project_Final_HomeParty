import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../review/entity/reveiw.entity';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User])],
  controllers: [AdminController],
  providers: [AdminService, UserService]
})
export class AdminModule {}
