import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgotPasswordSchema } from 'src/models/forgot.password.schema';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: 'VerifyForgotPassword', schema: ForgotPasswordSchema }]),
    MailerModule.forRoot({
      transport: 'smtps://22.ppandey@gmail.com:PRASH22face!@smtp.gmail.com',
      defaults: {
        from:'"nest-modules" <modules@nestjs.com>',
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
