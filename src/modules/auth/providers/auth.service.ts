import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/user.service';
import { TokenService } from './token.service';
import { TokenStorageService } from './token-storage.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import {AuthResponseDto, LogoutResponseDto, SafeUserDto, TokenPairDto} from '../dto/response.dto';
import { AUTH_MESSAGES } from '../constants/auth.constants';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 10;

    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly tokenStorageService: TokenStorageService,
    ) {}

    // În interiorul clasei AuthService

    async login(dto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.userService.findOneBy({ email: dto.email });
        const isPasswordValid = user
            ? await bcrypt.compare(dto.password, user.password)
            : false;

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException(AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS);
        }

        const tokens = await this.tokenService.generateTokens({
            sub: user.id,
            email: user.email,
        });

        await this.tokenStorageService.saveRefreshToken(user.id, tokens.refreshToken);

        // Mapăm explicit rezultatul
        return {
            tokens,
            user: this.excludePassword(user),
        };
    }

    private excludePassword(user: any): SafeUserDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async register(dto: RegisterDto): Promise<AuthResponseDto> {
        const existingUser = await this.userService.findOneBy({ email: dto.email });

        if (existingUser) {
            throw new ConflictException(AUTH_MESSAGES.REGISTER.EMAIL_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
        const createdUser = await this.userService.createUser({
            ...dto,
            password: hashedPassword,
        });

        const tokens = await this.tokenService.generateTokens({
            sub: createdUser.id,
            email: createdUser.email,
        });

        await this.tokenStorageService.saveRefreshToken(createdUser.id, tokens.refreshToken);

        return {
            tokens,
            user: this.excludePassword(createdUser),
        };
    }

    async logout(userId: string): Promise<LogoutResponseDto> {
        await this.tokenStorageService.revokeRefreshToken(userId);

        return {
            statusCode: 200,
            message: AUTH_MESSAGES.LOGOUT.SUCCESS,
        };
    }

    async refreshToken(rft: string): Promise<TokenPairDto> {
        const payload = await this.tokenService.verifyRefreshToken(rft);

        if (!payload) {
            throw new UnauthorizedException(AUTH_MESSAGES.TOKEN.INVALID_REFRESH);
        }

        const isValid = await this.tokenStorageService.validateRefreshToken(payload.sub, rft);

        if (!isValid) {
            throw new UnauthorizedException(AUTH_MESSAGES.TOKEN.INVALID_SESSION);
        }

        const newPayload = { sub: payload.sub, email: payload.email };
        const tokens = await this.tokenService.generateTokens(newPayload);

        await this.tokenStorageService.saveRefreshToken(payload.sub, tokens.refreshToken);

        return tokens;
    }
}