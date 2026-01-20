import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {LoginDto} from '../dto/login.dto';
import {RegisterDto} from '../dto/register.dto';
import {AuthResponseDto, LogoutResponseDto, RefreshTokenRequestDto, TokenPairDto,} from '../dto/response.dto';
import {AUTH_MESSAGES} from '../constants/auth.constants';
import {AuthService} from "../providers/auth.service";
import type {RequestWithUser} from "../interfaces/request-with-user.interface";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

@ApiTags('Autentificare')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Autentificare utilizator',
        description: 'Autentifică un utilizator și returnează token-uri JWT',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: AUTH_MESSAGES.LOGIN.SUCCESS,
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS,
    })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(dto);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Înregistrare utilizator nou',
        description: 'Creează un cont nou și returnează token-uri JWT',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: AUTH_MESSAGES.REGISTER.SUCCESS,
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: AUTH_MESSAGES.REGISTER.EMAIL_EXISTS,
    })
    register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(dto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Deconectare utilizator',
        description: 'Invalidează refresh token-ul utilizatorului curent',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: AUTH_MESSAGES.LOGOUT.SUCCESS,
        type: LogoutResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: AUTH_MESSAGES.TOKEN.INVALID_ACCESS,
    })
    logout(@Req() request: RequestWithUser): Promise<LogoutResponseDto> {
        const userId = request.user.sub;
        return this.authService.logout(userId);
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reîmprospătare token-uri',
        description: 'Generează token-uri noi folosind refresh token-ul valid',
    })
    @ApiBody({ type: RefreshTokenRequestDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Token-uri reîmprospătate cu succes',
        type: TokenPairDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: AUTH_MESSAGES.TOKEN.INVALID_REFRESH,
    })
    refreshToken(@Body('refreshToken') rft: string): Promise<TokenPairDto> {
        return this.authService.refreshToken(rft);
    }
}