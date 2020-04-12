import { Controller, Get, UseGuards, Put, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProfile } from '../user/user.dto';
import { UserService } from '../shared/user.service';
import { User } from '../utilities/user.decorator';

@Controller('user')
export class UserController {
     constructor(private userService: UserService) {}
    @Get('')
    // @UseGuards(AuthGuard())
    async getUserProfileById(){
    //   return await this.userService.findFromID(user.id);
    }

    @Post('updateCard')
    @UseGuards(AuthGuard('jwt'))
    async updateCard(@Body() userDTO: UserProfile) {
      return await this.userService.updateCard(userDTO);
    }

    @Get("getMyCard")
    @UseGuards(AuthGuard('jwt'))
    async getMyCard(@User() user) {
      return await this.userService.getProfile(user);
    }

    @Get("getSharedCards")
    @UseGuards(AuthGuard('jwt'))
    async getSharedCards(@User() user) {
      return await this.userService.getAllSharedProfiles(user);
    }


}
