import {
    HttpCode,
    Body,
    Controller,
    Patch,
    Post,
    Req,
    Request,
    Res,
    Response,
    UseGuards,
    Get,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @HttpCode(200)
    async login(@Request() req, @Response() res) {
        const { accessToken, refreshToken } = await this.authService.login(req.user);

        res.header('Authorization', `Bearer ${accessToken}`);
        res.header('Refresh-token', refreshToken);

        res.json({});
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile() {
        return "what"
    }

    // @Post('/kakao-login')

    @Post('/sign-up')
    async createUser(@Body() data: CreateUserDto): Promise<void> {
        console.log(data);
        return await this.authService.createUser(data);
    }

    // @Post('/find-email')

    // @Post('/find-password')

    // @Patch('/reset-password')
}
