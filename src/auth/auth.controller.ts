import { Body, Controller, Request, Post, Get, UseGuards } from '@nestjs/common';

import { UserService } from '../shared/user.service';
import { Payload } from '../types/payload';
import { LoginDTO, RegisterDTO, ChangePasswordDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDTO, VerifyForgotPasswordDTO } from './token.dto';
import { User } from '../utilities/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  
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
    // console.log("data at post", user);
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
  @UseGuards(AuthGuard('jwt'))
  async updatePassword(@Body('password') password, @User() user){
    return await this.authService.updatePassword({'password':password, 'email': user.email})
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req, @User() user){
    req.logout();
    return {'msg':'success'}
  }
}
