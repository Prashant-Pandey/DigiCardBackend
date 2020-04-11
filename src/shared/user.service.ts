import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
var bcrypt = require('bcryptjs');
import { Model } from 'mongoose';

import { LoginDTO, RegisterDTO, ChangePasswordDTO } from '../auth/auth.dto';
import { Payload } from '../types/payload';
import { User } from '../types/user';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(userDTO: RegisterDTO) {
    const { email } = userDTO;
    const user = await this.userModel.findOne({ email });
    // console.log(user, " from inside the user service, ", this.userModel.find());
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(userDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async find() {
    return await this.userModel.find();
  }

  async verifyEmail(email:String){
    let usr = this.userModel.findOne({email});
    if (!usr) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return {'_id':(await usr)._id,'email':(await usr).email};
  }

  async findByLogin(userDTO: LoginDTO) {
    const { email, password } = userDTO;
    const user = await this.userModel
      .findOne({ email })
      .select('email password created address');
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    // console.log(password);
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

  async updatePassword(changePassDTO: ChangePasswordDTO){
    const {email, password} = changePassDTO;
    const hashPassword = await bcrypt.hash(password, 10);;
    // console.log(hashPassword)
    return this.userModel.findOneAndUpdate({email},{'password':hashPassword}) 
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
    // return user.depopulate('password');
  }
}
