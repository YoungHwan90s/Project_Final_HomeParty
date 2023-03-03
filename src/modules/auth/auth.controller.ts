import { Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async abc() {
        return await this.authService.abc();
    }
    @Post('/kakao-login')
    async efg() {
        return await this.authService.efg();
    }
    
    @Post('/sign-up')
    async hij() {
        return await this.authService.hij();
    }
    
    @Post('/find-email') \
    async klm() {
        return await this.authService.klm();
    }
    
    @Post('/find-password')
    async nop() {
        return await this.authService.nop();
    }
    
    @Patch('/reset-password')
    async qrs() {
        return await this.authService.qrs();
    }
}


