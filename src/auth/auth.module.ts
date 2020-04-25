import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgotPasswordSchema } from '../models/forgot.password.schema';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: 'VerifyForgotPassword', schema: ForgotPasswordSchema }]),
    MailerModule.forRoot({
      transport: process.env.EMAIL_URI,
      defaults: {
        from:'"nest-modules" <modules@nestjs.com>',
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
