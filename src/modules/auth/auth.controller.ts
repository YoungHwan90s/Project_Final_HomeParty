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
    Get,
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
import {
    createUserSchema,
    findEmailSchema,
    findPasswordSchema,
    loginSchema,
    updatePasswordSchema,
} from 'src/util/joi/joi-validation';
import { CreateUserProfileDto } from '../user/dto/create-user-profile.dto';
import { UpdateResult } from 'typeorm';
import { User } from 'aws-sdk/clients/budgets';
import { Token } from 'aws-sdk/clients/cloudwatchlogs';
import { Email } from 'aws-sdk/clients/organizations';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';

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
    @UsePipes(new JoiValidationPipe(loginSchema))
    @HttpCode(200)
    async login(@Req() req): Promise<Token> {
        const user = req.user;
        return await this.authService.login(user);
    }

    @UseGuards(KakaoAuthGuard)
    @Get('/kakao')
    kakaoLogin() {}

    @UseGuards(KakaoAuthGuard)
    @Get('/kakao/callback')
    kakaoLoginCallback(@Req() req, @Res() res) {
        const { user, accessToken, refreshToken } = req.user;
        const email = user.email;
        const password = user.password;
        return res.render('index.ejs', {
            components: 'kakao',
            email,
            password,
            accessToken,
            refreshToken,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/logout')
    @HttpCode(200)
    async logout(@Req() req) {
        const user = req.user;

        await this.cacheService.del(user.id);
        await this.cacheService.del(user.email);

        return
    }

    @UseGuards(JwtAuthGuard)
    @Get('/my-info')
    @HttpCode(200)
    async getMyInfo(@Req() req): Promise<User> {
        return req.user;
    }

    @Post('/sign-up')
    @UsePipes(new JoiValidationPipe(createUserSchema))
    @HttpCode(201)
    async createUser(@Res() res, @Body() data: CreateUserDto): Promise<User> {
        const user = await this.userService.createUser(data);

        return res.send({ user });
    }

    @Patch('/profile-update')
    @HttpCode(201)
    async updateUserProfile(@Body() data: CreateUserProfileDto): Promise<UpdateResult> {
        return await this.userService.updateUserProfile(data);
    }

    @Post('/find-email')
    @UsePipes(new JoiValidationPipe(findEmailSchema))
    @HttpCode(200)
    async findEmail(@Body() data: FindEmailDto): Promise<Email> {
        return await this.userService.findEmail(data);
    }

    @Post('/email-authenticate')
    @UsePipes(new JoiValidationPipe(findPasswordSchema))
    @HttpCode(200)
    async findPassword(@Body() data: AuthenticateEmailDto): Promise<void> {
        const user = await this.userService.getUser(data.email);
        if (user) {
            const randomNum = Math.floor(Math.random() * 1000010);
            const randomNumtoString = String(randomNum);
            await this.cacheService.set(data.email, randomNumtoString, 120);

            this.mailService.sendMail(data.email, randomNum);
        }
        return;
    }

    @Post('/code-authentication')
    @HttpCode(200)
    async authenticateCode(@Body() data: AuthenticateCodeDto): Promise<number> {
        const authenticationCode = await this.cacheService.get(data.email);

        if (authenticationCode !== data.userAuthenticationCode) {
            throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
        }

        if (authenticationCode == data.userAuthenticationCode) {
            return await this.cacheService.del(data.email);
        }
    }

    @Patch('/reset-password')
    @UsePipes(new JoiValidationPipe(updatePasswordSchema))
    @HttpCode(200)
    async authenticateNumber(@Body() data: ResetPasswordDTO): Promise<UpdateResult> {
        return await this.userService.resetPassword(data);
    }
}
