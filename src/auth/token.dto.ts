import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export class VerifyForgotPasswordDTO{
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  token: string;
}

export class VerifyForgotPassword extends Document{
  email: string;
  password: string;
}



export class ForgotPasswordDTO {
  email: string;
}

