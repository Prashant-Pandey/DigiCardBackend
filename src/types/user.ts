import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { Optional } from '@nestjs/common';

export class Address {
  @ApiProperty()
  addr1: string;

  @ApiProperty()
  addr2: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  zip: number;
}

export class User extends Document {

  @ApiProperty()
  card: boolean;

  @ApiProperty()
  email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  phone_no:string;

  @ApiProperty()
  address: Address;

  @ApiProperty()
  position:string;

  @ApiProperty()
  company:string;

  @ApiProperty()
  socials:object;

  @ApiProperty()
  introduction:string

  @ApiProperty()
  sharedCardsArray:Array<string>;

  @ApiProperty()
  created: Date;
}
