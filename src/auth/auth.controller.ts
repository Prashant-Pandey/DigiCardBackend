import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';

import { UserService } from '../shared/user.service';
import { Payload } from '../types/payload';
import { LoginDTO, RegisterDTO, ChangePasswordDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDTO, VerifyForgotPasswordDTO } from './token.dto';

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
    console.log("data at post", user);
    const payload: Payload = {
      email: user.email
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Get("forgot")
  async forgotPassword(@Body() forgotPass: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(forgotPass);
  }

  @Post("verifyForgotPassword")
  async verifyForgotPassword(@Body() verifyForgotPass: VerifyForgotPasswordDTO){
    return await this.authService.verifyForgotPassword(verifyForgotPass);
  }

  @Post('updatePassword')
  @UseGuards(AuthGuard())
  async updatePassword(@Body() changePasswordDTO:ChangePasswordDTO){
    return await this.authService.updatePassword(changePasswordDTO)
  }
}
