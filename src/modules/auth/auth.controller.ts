import {
    HttpCode,
    Body,
    Controller,
    Patch,
    Post,
    Res,
    UseGuards,
    Req,
    UnauthorizedException,
    UsePipes,
} from '@nestjs/common';
import { MailService } from '../../util/node-mailer/mail.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthenticateEmailDto } from './dto/authenticate-email.dto';
import { LocalAuthGuard } from './guards/auth.guard';

import { UserService } from '../user/user.service';
import { FindEmailDto } from './dto/find-email.dto';
import { CacheService } from '../../util/cache/cache.service';
import { AuthenticateCodeDto } from './dto/authenticate-code.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { JoiValidationPipe } from 'src/util/joi/joi-validation.pipe';
import { createUserSchema } from 'src/util/joi/joi-validation';

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

        return res.json({});
    }

    @Post('/sign-up')
    // @UsePipes(new JoiValidationPipe(createUserSchema))
    @HttpCode(201)
    async createUser(@Res() res, @Body() data: CreateUserDto) {
        await this.userService.createUser(data);

        return res.send({});
    }

    @Post('/find-email')
    @HttpCode(200)
    async findEmail(@Res() res, @Body() data: FindEmailDto) {
        const email = await this.authService.findEmail(data);

        return res.send({ email });
    }

    @Post('/email-authenticate')
    @HttpCode(200)
    async findPassword(@Res() res, @Body() data: AuthenticateEmailDto) {
        const user = await this.userService.getUser(data.email);
        if (user) {
            const randomNum = Math.floor(Math.random() * 1000010);
            const randomNumtoString = String(randomNum);
            await this.cacheService.set(data.email, randomNumtoString, 120);

            await this.mailService.sendMail(data.email, randomNum);
        }

        return res.send({});
    }

    @Post('/code-authentication')
    @HttpCode(200)
    async authenticateCode(@Res() res, @Body() data: AuthenticateCodeDto) {
        const authenticationCode = await this.cacheService.get(data.email);

        // 인증번호가 다를 때 에러
        if (authenticationCode !== data.userAuthenticationCode) {
            throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
        }

        if (authenticationCode == data.userAuthenticationCode) {
            await this.cacheService.del(data.email);

            return res.send({});
        }
    }

    @Patch('/reset-password')
    @HttpCode(200)
    async authenticateNumber(@Res() res, @Body() data: ResetPasswordDTO) {
        await this.userService.resetPassword(data);

        return res.send({});
    }
}
