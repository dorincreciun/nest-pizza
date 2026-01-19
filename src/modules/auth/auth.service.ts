import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {LoginDto} from "./dto/login.dto";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findOneBy({ email: dto.email });

        const isPasswordValid = user ? await bcrypt.compare(dto.password, user.password) : false;

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Email-ul sau parola sunt incorecte');
        }
    }
}