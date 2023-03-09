import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { WishList } from './entity/wish-list.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, WishList]), AuthModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
