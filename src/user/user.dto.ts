import { Address } from '../types/user';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfile {

  @ApiProperty()
  card: Boolean;

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
  position:String;

  @ApiProperty()
  company:String;

  @ApiProperty()
  socials:Object;

  @ApiProperty()
  introduction:String;

  @ApiProperty()
  sharedCardsArray:[];
}
