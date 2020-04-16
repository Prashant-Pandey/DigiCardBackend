import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class RegisterDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  first_name?: string;

  @ApiProperty()
  last_name?: string;
}

export class ChangePasswordDTO{
  @ApiProperty()
  password: string;
  
  @ApiProperty()
  email: string;
}