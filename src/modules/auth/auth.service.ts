import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
}