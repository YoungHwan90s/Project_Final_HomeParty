import { Body, Controller, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        return req.user;
      }

    // @Post('/kakao-login')
    
    @Post('/sign-up')
    async createUser(@Body() data: CreateUserDto): Promise<void> {
        console.log(data)
        return await this.authService.createUser(data)
    }
    
    // @Post('/find-email')
    
    // @Post('/find-password')
    
    // @Patch('/reset-password')
}
