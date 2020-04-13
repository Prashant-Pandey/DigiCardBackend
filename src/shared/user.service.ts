import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
var bcrypt = require('bcryptjs');
import { Model } from 'mongoose';

import { LoginDTO, RegisterDTO, ChangePasswordDTO } from '../auth/auth.dto';
import { UserProfile } from '../user/user.dto';
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
    const hashPassword = await bcrypt.hash(password, 10);
    return this.userModel.findOneAndUpdate({email},{'password':hashPassword});
  }

  async updateCard(userDTO: UserProfile, user: User){
     const {phone_no, address, position, company, socials} = userDTO;
     const {email} = user;
     return this.userModel.findOneAndUpdate({email}, {$set:
      {
        phone_no,
        address,
        position,
        company,
        socials
      }
    });
  }

  async getAllSharedProfiles(user: User): Promise<Array<User>>{
    const {email} = user;
    const cardData = await this.userModel.findOne({email});
    if (!cardData) {
      throw new HttpException('Invalid user, please contact admin for help', HttpStatus.UNAUTHORIZED);
    }
    let res = []
    for (let id in cardData.sharedCardsArray) {
      let tempData = await this.userModel.findById(cardData.sharedCardsArray[id]);
      if (!tempData) {
        res.push({'msg':'not found'})
      }else{
        res.push(tempData);
      }
    }
    return res;
  }

  async setSharedCard(user: User,userID: String){
    const {email} = user;
    if (user.id==userID) {
      throw new HttpException('Cannot share your own profile to yourself', HttpStatus.BAD_REQUEST);
    }
    const sharedUser = await this.userModel.findById(userID);
    if (!sharedUser) {
      throw new HttpException('Invalid user shared!', HttpStatus.BAD_REQUEST);
    }
    const savingStatus = await this.userModel.findOneAndUpdate({email},{
        $push:{
          sharedCardsArray: userID
        }
    });
    if (!savingStatus) {
      throw new HttpException('Error saving userID in Database', HttpStatus.UNAUTHORIZED);
    }
    return sharedUser;
  }

  async getProfile(userData: User){
    const {email} = userData;
    const cardData = await this.userModel.findOne({email});
    if (!cardData) {
      throw new HttpException('Invalid user, please contact admin for help', HttpStatus.UNAUTHORIZED);
    }
    return cardData;
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
    // return user.depopulate('password');
  }
}
