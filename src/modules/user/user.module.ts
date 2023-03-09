import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { WishList } from './entity/wish-list.entity';
import { AuthModule } from '../auth/auth.module';
import { Party } from '../party/entity/party.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, WishList, Party]), AuthModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
