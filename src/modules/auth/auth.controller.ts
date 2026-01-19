import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    /* --- */
    @Post('login')
    async login(@Body() dto: LoginDto){
        return this.authService.login(dto)
    }

    /* --- */
    @Post('register')
    register(@Body() dto: CreateUserDto){
        return this.authService.register(dto)
    }

    /* --- */
    @Post('logout')
    logout(){}

    /* --- */
    @Post('refresh-token')
    refreshToken(){}
}
