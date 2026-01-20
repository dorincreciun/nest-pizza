import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {JwtPayloadInterface, TokenPair, TokenTypes} from "../interfaces/jwt-payload.interface";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TokenService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {
    }

    async verifyAccessToken(token: string): Promise<JwtPayloadInterface> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_ACCESS_SECRET')
            });
        } catch (e) {
            throw new UnauthorizedException('Access Token invalid sau expirat');
        }
    }

    async verifyRefreshToken(token: string): Promise<JwtPayloadInterface> {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET')
            })
        } catch (e) {
            throw new UnauthorizedException('Token invalid sau expirat')
        }
    }

    async generateTokens(payload: JwtPayloadInterface): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payload),
            this.generateRefreshToken(payload)
        ])

        return {
            accessToken,
            refreshToken
        }
    }

    async generateAccessToken(payload: JwtPayloadInterface) {
        return this.generateToken(payload, "accessToken")
    }

    async generateRefreshToken(payload: JwtPayloadInterface) {
        return this.generateToken(payload, "refreshToken")
    }

    private async generateToken(payload: JwtPayloadInterface, type: TokenTypes) {
        const secretKey = type === "accessToken" ? "JWT_ACCESS_SECRET" : "JWT_REFRESH_SECRET"
        const expiresInKey = type === "accessToken" ? "JWT_ACCESS_EXPIRES_IN" : "JWT_REFRESH_EXPIRES_IN"

        return this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>(secretKey),
            expiresIn: this.configService.get<any>(expiresInKey)
        })
    }
}
