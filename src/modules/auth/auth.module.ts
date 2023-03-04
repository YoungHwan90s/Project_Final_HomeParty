import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from '../user/entity/user.entity';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local-strategy';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            session: false,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
})
export class AuthModule {}

// imports: [TypeOrmModule.forFeature([User])],
// controllers: [AuthController],
// providers: [AuthService]
// })

// JwtModule.registerAsync({
//   imports: [ConfigModule],
//   // useClass: JwtConfigService,
//   inject: [ConfigService],
// }),
