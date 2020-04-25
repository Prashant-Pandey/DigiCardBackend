import { Address } from '../types/user';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfile {

  @ApiProperty()
  card: boolean;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  first_name?: string;

  @ApiProperty()
  last_name?: string;

  @ApiProperty()
  phone_no: string;

  @ApiProperty()
  address: Address;

  @ApiProperty()
  position:string;

  @ApiProperty()
  company:string;

  @ApiProperty()
  socials:object;

  @ApiProperty()
  introduction:string;

  @ApiProperty()
  sharedCardsArray:Array<string>;
}

export class commonVisible{
  txt:string;
  visiblility:string;

}

export class userIdDTO{
  @ApiProperty()
  userID: string;
}