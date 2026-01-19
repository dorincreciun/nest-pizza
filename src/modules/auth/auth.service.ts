import {Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginDto} from "./dto/login.dto";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt"
import {TokenService} from "./token.service";

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
}