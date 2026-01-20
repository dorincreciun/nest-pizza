import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { UserService } from '../../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findOneBy({ email: dto.email });

        const isPasswordValid = user ? await bcrypt.compare(dto.password, user.password) : false;

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Email-ul sau parola sunt incorecte');
        }

        const tokens = await this.tokenService.generateTokens({
            sub: user.id,
            email: user.email
        })

        await this.userService.updateRefreshToken(user.id, tokens.refreshToken)

        const { password, ...safeUser } = user;
        return {
            tokens,
            user: safeUser
        };
    }

    async register(dto: CreateUserDto) {
        const existingUser = await this.userService.findOneBy({ email: dto.email });
        if (existingUser) {
            throw new ConflictException('Email-ul este deja înregistrat');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUserPayload = {
            ...dto,
            password: hashedPassword,
        };

        const createdUser = await this.userService.createUser(newUserPayload);

        const tokens = await this.tokenService.generateTokens({
            sub: createdUser.id,
            email: createdUser.email,
        });

        await this.userService.updateRefreshToken(createdUser.id, tokens.refreshToken);

        const { password, ...safeUser } = createdUser;

        return {
            tokens,
            user: safeUser,
        };
    }

    async logout(userId: string) {
        await this.userService.updateRefreshToken(userId, null)

        return {
            statusCode: 200,
            message: 'Deconectare reușită!'
        };
    }

    async refreshToken(rft: string) {
        const payload = await this.tokenService.verifyRefreshToken(rft);

        if (!payload) {
            throw new UnauthorizedException("Refresh Token invalid sau expirat!");
        }

        const isValid = await this.userService.isRefreshTokenValid(payload.sub, rft);

        if (!isValid) {
            throw new UnauthorizedException("Sesiune invalidă. Vă rugăm să vă logați din nou.");
        }

        const newPayload = {
            sub: payload.sub,
            email: payload.email
        };

        const tokens = await this.tokenService.generateTokens(newPayload);

        await this.userService.updateRefreshToken(payload.sub, tokens.refreshToken);

        return tokens;
    }
}