import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import {AuthGuard} from "../guards/auth.guard";
import type {RequestWithUser} from "../interfaces/reuqest-with-user.interface";

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
    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Req() request: RequestWithUser){
        const userId = request.user.sub
        return this.authService.logout(userId)
    }

    /* --- */
    @Post('refresh-token')
    refreshToken(){}
}
