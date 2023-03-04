import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @Post('/login')

    // @Post('/kakao-login')
    
    @Post('/sign-up')
    async createUser(@Body() data: CreateUserDto) {
        console.log(data)
        return await this.authService.createUser(data)
    }
    
    // @Post('/find-email')
    
    // @Post('/find-password')
    
    // @Patch('/reset-password')
}
