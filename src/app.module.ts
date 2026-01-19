import {Module} from '@nestjs/common';
import {DatabaseModule} from './modules/database/database.module';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from './modules/auth/auth.module';
import {UserModule} from './modules/user/user.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      DatabaseModule,
      AuthModule,
      UserModule,
  ],
})
export class AppModule {}
