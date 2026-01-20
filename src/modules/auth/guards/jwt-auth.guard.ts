// src/modules/auth/guards/auth.guard.ts

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AUTH_MESSAGES } from '../constants/auth.constants';
import {TokenService} from "../providers/token.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException(AUTH_MESSAGES.TOKEN.MISSING);
        }

        const payload = await this.tokenService.verifyAccessToken(token);

        if (!payload) {
            throw new UnauthorizedException(AUTH_MESSAGES.TOKEN.INVALID_ACCESS);
        }

        request['user'] = payload;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return undefined;
        }

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}