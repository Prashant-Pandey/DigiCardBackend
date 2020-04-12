import { Controller, Get, UseGuards, Put, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserProfile } from '../user/user.dto';
import { UserService } from '../shared/user.service';



@Controller('user')
export class UserController {
     constructor(private userService: UserService) {}
    @Get('')
    // @UseGuards(AuthGuard())
    async getUserProfileById(){
    //   return await this.userService.findFromID(user.id);
    }

    @Post('createCard')
    async createCard(@Body() userDTO: UserProfile) {
      const user = await this.userService.updateCard(userDTO);
      return { user };
    }

    @Get("getMyCard")
    async getMyCard(@Body() userDTO: UserProfile) {
      return await this.userService.getProfile(userDTO);
    }

    @Get("getSharedCards")
    async getSharedCards(@Body() userDTO: UserProfile) {
      // const myProfile = await this.userService.getProfile(userDTO);
      // //fetch the fields and loop through sharedID to generate cards and return
      // myProfile.sharedCardsArray.array.forEach(element => {
      //
      // });
    }


}
