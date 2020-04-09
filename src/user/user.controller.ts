import { Controller, Get, UseGuards, Put, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
export class UserController {
    // constructor(private userService: UserService) {}
    @Get('')
    // @UseGuards(AuthGuard())
    async getUserProfileById(){
    //   return await this.userService.findFromID(user.id);
    }   
}
