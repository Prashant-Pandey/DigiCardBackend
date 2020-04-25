import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../shared/user.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UserController]
})
export class UserModule { }
