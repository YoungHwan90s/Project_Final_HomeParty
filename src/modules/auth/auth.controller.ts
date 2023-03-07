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
} from '@nestjs/common';
import { MailService } from '../node-mailer/mail.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { EmailAuthenticationDto } from './dto/email-authentication.dto';
import { LocalAuthGuard } from './guards/auth.guard';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @HttpCode(200)
    async login(@Req() req, @Res() res) {
        try {
            const { accessToken, refreshToken } = await this.authService.login(req.user);
    
            res.header('authorization', `Bearer ${accessToken}`);
            res.header('refreshtoken', refreshToken);
    
            res.json({});
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    @Post('/sign-up')
    @HttpCode(201)
    async createUser(@Body() data: CreateUserDto) {
        try {
            return await this.userService.createUser(data);
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    @Post('/email-authenticate')
    @HttpCode(200)
    async FindPasswordDTO(@Body() data: EmailAuthenticationDto) {
        try {
            const user = await this.userService.getUser(data.email);
    
            if (user) {
                this.mailService.sendMail(user.email, data.authenticationCdoe);
            }
            return
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }

    @Patch('/reset-password')
    @HttpCode(201)
    async resetPassword(@Body() data: ResetPasswordDTO) {
        try {
            return this.userService.resetPassword(data)
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }
}
