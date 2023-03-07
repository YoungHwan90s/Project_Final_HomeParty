import {
    HttpCode,
    Body,
    Controller,
    Patch,
    Post,
    Res,
    UseGuards,
    HttpException,
    Req,
    Get,
    UnauthorizedException,
} from '@nestjs/common';
import { MailService } from '../node-mailer/mail.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthenticateEmailDto } from './dto/authenticate-email.dto';
import { LocalAuthGuard } from './guards/auth.guard';

import { UserService } from '../user/user.service';
import { FindEmailDto } from './dto/find-email.dto';
import { CacheService } from '../cache/cache.service';
import { AuthenticateCodeDto } from './dto/authenticate-code.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        private readonly cacheService: CacheService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @HttpCode(200)
    async login(@Req() req, @Res() res) {
        const { accessToken, refreshToken } = await this.authService.login(req.user);

        res.header('authorization', `Bearer ${accessToken}`);
        res.header('refreshtoken', refreshToken);

        return;
    }

    @Post('/sign-up')
    @HttpCode(201)
    async createUser(@Body() data: CreateUserDto) {
        return await this.userService.createUser(data);
    }

    @Get('/find-email')
    @HttpCode(200)
    async findEmail(@Body() data: FindEmailDto) {
        return this.authService.findEmail(data);
    }

    @Post('/email-authenticate')
    @HttpCode(200)
    async FindPasswordDTO(@Body() data: AuthenticateEmailDto) {
        const user = await this.userService.getUser(data.email);

        if (user) {
            const randomNum = Math.floor(Math.random() * 1000010);
            const randomNumtoString = String(randomNum);
            await this.cacheService.set(data.email, randomNumtoString);

            this.mailService.sendMail(data.email, randomNum);
        }
        return;
    }

    @Post('/code-authentication')
    @HttpCode(200)
    async authenticateCode(@Body() data: AuthenticateCodeDto) {
        const authenticationCode = await this.cacheService.get(data.email);

        // 인증번호가 다를 때 에러
        if (authenticationCode !== data.userAuthenticationCode) {
            throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
        }

        if (authenticationCode == data.userAuthenticationCode) {
            await this.cacheService.del(data.email);
            return;
        }
    }

    @Post('/reset-password')
    @HttpCode(200)
    async authenticateNumber(@Body() data: ResetPasswordDTO) {
        return this.userService.resetPassword(data);
    }
}
