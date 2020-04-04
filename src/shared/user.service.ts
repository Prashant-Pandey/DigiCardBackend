import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
var bcrypt = require('bcryptjs');
import { Model } from 'mongoose';

import { LoginDTO, RegisterDTO, VerifyForgotPassword } from '../auth/auth.dto';
import { Payload } from '../types/payload';
import { User } from '../types/user';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(userDTO: RegisterDTO) {
    const { email } = userDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(userDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async forgotPassword(email: string){
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    // send mail to the user
    return {'token':'skdhbsjhdbshdbshdb', '_id':'sndhsabvghdvasgvdas'}
  }

  async verifyForgotPassword(verifyForgotPass: VerifyForgotPassword) {
    const { email, token } = verifyForgotPass;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }
    // send mail to the user
    
    return {'msg':'success'}
  }

  async find() {
    return await this.userModel.find();
  }

  async findByLogin(userDTO: LoginDTO) {
    const { email, password } = userDTO;
    const user = await this.userModel
      .findOne({ email })
      .select('email password created address');
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
    // return user.depopulate('password');
  }
}
