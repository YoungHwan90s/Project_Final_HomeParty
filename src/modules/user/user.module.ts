import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { WishList } from './entity/wish-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WishList])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
