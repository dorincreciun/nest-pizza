import {Module} from '@nestjs/common';
import {DatabaseModule} from './modules/database/database.module';
import {ConfigModule} from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenService } from './auth/token.service';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      DatabaseModule,
      UsersModule,
      AuthModule,
      UserModule,
  ],
  providers: [TokenService],
})
export class AppModule {}
