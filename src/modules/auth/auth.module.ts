import {Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {AuthController} from './controllers/auth.controller';
import {UserModule} from "../user/user.module";
import {TokenService} from './services/token.service';
import {JwtModule} from "@nestjs/jwt";
import {TokenStorageService} from "./services/token-storage.service";

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
