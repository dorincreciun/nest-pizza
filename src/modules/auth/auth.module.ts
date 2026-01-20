import {Module} from '@nestjs/common';
import {AuthService} from './providers/auth.service';
import {AuthController} from './controllers/auth.controller';
import {UserModule} from "../user/user.module";
import {TokenService} from './providers/token.service';
import {JwtModule} from "@nestjs/jwt";
import {TokenStorageService} from "./providers/token-storage.service";

@Module({
    imports: [UserModule, JwtModule],
    providers: [
        AuthService,
        TokenService,
        TokenStorageService
    ],
    controllers: [AuthController]
})
export class AuthModule {
}
