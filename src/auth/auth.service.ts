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
    console.log(email)
    if (!await this.userService.verifyEmail(email)&&await this.verifyForgotPassData(email)) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    // generate token 
    const token = parseInt((Math.random()*1000000).toString());
    // save token to db
    this.vforgotpassword.create({email, token});
    // send mail to the user and return sucess message
    await this.sendEmail(email, token)
    return {'msg':'success'};
  }

  async sendEmail(email:string, token:any){
    this
      .mailerService
      .sendMail({
        from: '22.ppandey@gmail.com',
        to: email,
        subject: 'Verification Token',
        text: token+" is the verification token for you DigiCard"
      }).then((msg)=>{
        console.log(msg)
        return msg;
      }).catch((error)=>{
        throw new HttpException(error+" from the mailer", HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  async verifyForgotPassword(verifyForgotPass: VerifyForgotPasswordDTO) {
    const { email, token, password } = verifyForgotPass;
    // const user = await this.userService.verifyEmail(email);
    // if (!user) {
    //   throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    // }
    // verify the token to corresponding user
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
