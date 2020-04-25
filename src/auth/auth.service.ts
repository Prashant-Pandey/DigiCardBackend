import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../shared/user.service';
import { Payload } from '../types/payload';
import { ForgotPasswordDTO, VerifyForgotPasswordDTO, VerifyForgotPassword } from './token.dto';
import { ChangePasswordDTO } from './auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(@InjectModel('VerifyForgotPassword') private vforgotpassword: Model<VerifyForgotPassword>, 
  private userService: UserService, private readonly mailerService: MailerService) {}
  

  async signPayload(payload: Payload) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '12h' });
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  async verifyForgotPassData(emai:String){
    const user = await this.vforgotpassword.findOne(emai);
    if (user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  
  async forgotPassword(forgotPasswordDto: ForgotPasswordDTO){
    const {email} = forgotPasswordDto;
    // console.log(email)
    if (!await this.userService.verifyEmail(email)&&await this.verifyForgotPassData(email)) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    // generate token 
    const token = parseInt((Math.random()*1000000).toString());
    // send mail to the user and return sucess message
    let mailerResponse = await this.sendEmail(email, 'Verification Token', (token+" is the verification token for you DigiCard"));
    if(!mailerResponse){
      throw new HttpException("error from the mailer", HttpStatus.INTERNAL_SERVER_ERROR);
    }else{
      // save token to db
      this.vforgotpassword.create({email, token});
      return {'msg':'success'};
    }
  }

  async sendEmail(email:string, sub:string, message:string){
    return this.mailerService .sendMail({
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: sub,
        text: message
      });
  }

  // validate email
  async verifyForgotPassword(verifyForgotPass: VerifyForgotPasswordDTO) {
    const { email, token, password } = verifyForgotPass;
    const tokenData = await this.vforgotpassword.findOne({email});
    if (!tokenData) {
      throw new HttpException('Please make sure to create forgot password request first', HttpStatus.BAD_REQUEST);
    }

    if (tokenData.get('token') !== token) {
      throw new HttpException('Please make sure email and token are inputted correctly', HttpStatus.BAD_REQUEST);
    }
    // delete the token
    let deleteData = await this.vforgotpassword.remove({email});
    if (!deleteData) {
      throw new HttpException('Technical issue! contact support@digicard.com', HttpStatus.EXPECTATION_FAILED);
    }
    // update password and return response
    return this.updatePassword({password, email});
  }

  async updatePassword(changePasswordDTO: ChangePasswordDTO){
    // const {password,email} = changePasswordDTO;
    // if (password.length==0||email.length==0||!email.match('^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$')) {
    //   throw new HttpException('Please input Valid Password', HttpStatus.BAD_REQUEST);
    // }
    // update password
    return this.userService.updatePassword(changePasswordDTO)
  }
}
