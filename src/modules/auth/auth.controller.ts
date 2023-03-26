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
    async login(@Req() req, @Res() res): Promise<Token> {
        const user = req.user;
        const { accessToken, refreshToken } = await this.authService.login(user);

        return res.json({ accessToken, refreshToken });
    }

    @UseGuards(KakaoAuthGuard)
    @Get('/kakao')
    kakaoLogin() {}

    @UseGuards(KakaoAuthGuard)
    @Get('/kakao/callback')
    async kakaoLoginCallback(@Req() req, @Res() res) {
        const { user, accessToken, refreshToken } = req.user;

        const userInfo = JSON.stringify(user);
        await this.cacheService.set(user.email, userInfo);

        return res.render('index.ejs', { components: 'kakao', user, accessToken, refreshToken });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/logout')
    @HttpCode(200)
    async logout(@Req() req, @Res() res) {
        const user = req.user;

        await this.cacheService.del(user.id);
        await this.cacheService.del(user.email);

        return res.json({});
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
    async updateUserProfile(@Res() res, @Body() data: CreateUserProfileDto): Promise<UpdateResult> {
        await this.userService.updateUserProfile(data);
        return res.json({});
    }

    @Post('/find-email')
    @UsePipes(new JoiValidationPipe(findEmailSchema))
    @HttpCode(200)
    async findEmail(@Res() res, @Body() data: FindEmailDto): Promise<Email> {
        const email = await this.userService.findEmail(data);

        return res.send({ email });
    }

    @Post('/email-authenticate')
    @UsePipes(new JoiValidationPipe(findPasswordSchema))
    @HttpCode(200)
    async findPassword(@Res() res, @Body() data: AuthenticateEmailDto): Promise<void> {
        const user = await this.userService.getUser(data.email);
        if (user) {
            const randomNum = Math.floor(Math.random() * 1000010);
            const randomNumtoString = String(randomNum);
            await this.cacheService.set(data.email, randomNumtoString, 120);

            this.mailService.sendMail(data.email, randomNum);
        }

        return res.send({});
    }

    @Post('/code-authentication')
    @HttpCode(200)
    async authenticateCode(@Res() res, @Body() data: AuthenticateCodeDto): Promise<void> {
        const authenticationCode = await this.cacheService.get(data.email);

        if (authenticationCode !== data.userAuthenticationCode) {
            throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
        }

        if (authenticationCode == data.userAuthenticationCode) {
            await this.cacheService.del(data.email);

            return res.send({});
        }
    }

    @Patch('/reset-password')
    @UsePipes(new JoiValidationPipe(updatePasswordSchema))
    @HttpCode(200)
    async authenticateNumber(@Res() res, @Body() data: ResetPasswordDTO): Promise<UpdateResult> {
        await this.userService.resetPassword(data);

        return res.send({});
    }
}
