import { Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @Post('/login')

    // @Post('/kakao-login')
    
    // @Post('/sign-up')
    
    // @Post('/find-email')
    
    // @Post('/find-password')
    
    // @Patch('/reset-password')
}
