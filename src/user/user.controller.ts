import { Controller, Get, UseGuards, Put, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProfile, userIdDTO } from '../user/user.dto';
import { UserService } from '../shared/user.service';
import { User } from '../utilities/user.decorator';

@Controller('user')
export class UserController {
     constructor(private userService: UserService) {}
    @Get('')
    async HelloWorld(){
      return 'hello user'
    }

    @Post('updateCard')
    @UseGuards(AuthGuard('jwt'))
    async updateCard(@Body() userDTO: UserProfile, @User() user) {
      return await this.userService.updateCard(userDTO, user);
    }

    @Get("getMyCard")
    @UseGuards(AuthGuard('jwt'))
    async getMyCard(@User() user) {
      return await this.userService.getProfile(user);
    }

    @Get("getSharedCards")
    @UseGuards(AuthGuard('jwt'))
    async getSharedCards(@User() user) {
      console.log('into the get all shared content')
      return await this.userService.getAllSharedProfiles(user);
    }

    @Post("setSharedCard")
    @UseGuards(AuthGuard('jwt'))
    async setSharedCard(@User() user, @Body() userId: userIdDTO) {
      return await this.userService.setSharedCard(user, userId);
    }
}
