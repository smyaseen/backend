import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { passwordLength } from 'utils/constants';
import { invalidPasswordLengthMessage } from 'utils/constants';
import { invalidPasswordMessage } from 'utils/constants';
import { passwordRegex } from 'utils/constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Matches(/^[a-zA-Z]+\s[a-zA-Z]+$/, {
    message: 'name must be a full name with at least one space',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(passwordRegex, {
    message: invalidPasswordMessage,
  })
  @Length(passwordLength.min, passwordLength.max, {
    message: invalidPasswordLengthMessage,
  })
  password: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(passwordRegex, {
    message:
      'wrong email or password, please check your credentials and try again',
  })
  @Length(passwordLength.min, passwordLength.max, {
    message:
      'wrong email or password, please check your credentials and try again',
  })
  readonly password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
