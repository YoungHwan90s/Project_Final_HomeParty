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
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { FindEmailDto } from './dto/find-email.dto';
import { LocalAuthGuard } from './guards/auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @HttpCode(200)
    async login(@Request() req, @Res() res) {
        const { accessToken, refreshToken } = await this.authService.login(req.user);

        res.setHeader('authorization', `Bearer ${accessToken}`);
        res.header('refreshtoken', refreshToken);

        res.json({});
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        const { id } = req.user;
        console.log('profile', id);
        return 'what';
    }

    // @Post('/kakao-login')

    @Post('/sign-up')
    async createUser(@Body() data: CreateUserDto): Promise<void> {
        console.log(data);
        return await this.authService.createUser(data);
    }

    @Get('/find-email')
    findEmail(@Body() data: FindEmailDto) {
        return this.authService.findEmail(data);
    }

    // @Post('/find-password')

    // @Patch('/reset-password')
}
