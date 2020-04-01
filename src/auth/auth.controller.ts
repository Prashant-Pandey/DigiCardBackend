import { Body, Controller, Post, Get } from '@nestjs/common';

import { UserService } from '../shared/user.service';
import { Payload } from '../types/payload';
import { LoginDTO, RegisterDTO, VerifyForgotPassword } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiResponse({ status: 200, description: 'The user has been successfully created.'})
  @Post('login')
  async login(@Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO);
    const payload: Payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const user = await this.userService.create(userDTO);
    const payload: Payload = {
      email: user.email
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Get("forgotPassword")
  async forgotPassword(@Body() email: string) {
    return await this.userService.forgotPassword(email);
  }

  @Post("verifyForgotPassword")
  async verifyForgotPassword(@Body() verifyForgotPass: VerifyForgotPassword){
    return await this.userService.verifyForgotPassword(verifyForgotPass);
  }
}
