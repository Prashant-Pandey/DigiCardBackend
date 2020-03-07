import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

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
  username: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  seller: boolean;

  @ApiProperty()
  address: Address;

  @ApiProperty()
  created: Date;
}
