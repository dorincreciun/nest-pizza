import {Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {AuthController} from './controllers/auth.controller';
import {UserModule} from "../user/user.module";
import {TokenService} from './services/token.service';
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [UserModule, JwtModule],
    providers: [AuthService, TokenService],
    controllers: [AuthController]
})
export class AuthModule {
}
