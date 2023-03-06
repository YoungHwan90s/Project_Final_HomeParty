import {
    HttpCode,
    Body,
    Controller,
    Patch,
    Post,
    Req,
    Request,
    Res,
    UseGuards,
    Get,
} from '@nestjs/common';
import { MailService } from '../node-mailer/mail.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { FindEmailDto } from './dto/find-email.dto';
import { FindPasswordDto } from './dto/find-password.dto';
import { LocalAuthGuard } from './guards/auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @HttpCode(200)
    async login(@Request() req, @Res() res) {
        const { accessToken, refreshToken } = await this.authService.login(req.user);

        res.header('authorization', `Bearer ${accessToken}`);
        res.header('refreshtoken', refreshToken);

        res.json({});
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req) {
        const { id } = req.user;
        console.log('profile', id);
        return 'what';
    }

    // @Post('/kakao-login')

    @Post('/sign-up')
    async createUser(@Body() data: CreateUserDto) {
        return await this.authService.createUser(data);
    }

    @Get('/find-email')
    async findEmail(@Body() data: FindEmailDto) {
        return this.authService.findEmail(data);
    }

    @Post('/find-password')
    async FindPasswordDTO(@Body() data: FindPasswordDto) {
        const user = await this.authService.getUser(data);

        if (user) {
            this.mailService.sendHello(user.email);
        }
    }

    // @Patch('/reset-password')
}
