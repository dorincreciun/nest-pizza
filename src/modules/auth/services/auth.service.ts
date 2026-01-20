import {ConflictException, Injectable, UnauthorizedException} from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import {UserService} from "../../user/user.service";
import {TokenService} from "./token.service";
import {TokenStorageService} from "./token-storage.service";
import {LoginDto} from "../dto/login.dto";
import {RegisterDto} from "../dto/register.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly tokenStorageService: TokenStorageService,
    ) {}

    async login(dto: LoginDto) {
        const user = await this.userService.findOneBy({ email: dto.email });
        const isPasswordValid = user
            ? await bcrypt.compare(dto.password, user.password)
            : false;

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Email-ul sau parola sunt incorecte');
        }

        const tokens = await this.tokenService.generateTokens({
            sub: user.id,
            email: user.email
        });

        await this.tokenStorageService.saveRefreshToken(user.id, tokens.refreshToken);

        const { password, ...safeUser } = user;
        return { tokens, user: safeUser };
    }

    async register(dto: RegisterDto) {
        const existingUser = await this.userService.findOneBy({ email: dto.email });
        if (existingUser) {
            throw new ConflictException('Email-ul este deja înregistrat');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const createdUser = await this.userService.createUser({
            ...dto,
            password: hashedPassword,
        });

        const tokens = await this.tokenService.generateTokens({
            sub: createdUser.id,
            email: createdUser.email,
        });

        await this.tokenStorageService.saveRefreshToken(createdUser.id, tokens.refreshToken);

        const { password, ...safeUser } = createdUser;
        return { tokens, user: safeUser };
    }

    async logout(userId: string) {
        await this.tokenStorageService.revokeRefreshToken(userId);

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

        const isValid = await this.tokenStorageService.validateRefreshToken(payload.sub, rft);

        if (!isValid) {
            throw new UnauthorizedException("Sesiune invalidă. Vă rugăm să vă logați din nou.");
        }

        const newPayload = { sub: payload.sub, email: payload.email };
        const tokens = await this.tokenService.generateTokens(newPayload);

        await this.tokenStorageService.saveRefreshToken(payload.sub, tokens.refreshToken);

        return tokens;
    }
}