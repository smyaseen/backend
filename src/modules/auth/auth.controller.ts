import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from 'dtos/user.dto';
import { RegistrationStatus } from './interfaces/auth.interface';
import { IUserAuthResponse } from 'interfaces/user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus =
      await this.authService.register(createUserDto);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<IUserAuthResponse> {
    return await this.authService.login(loginUserDto);
  }

  @Post('refresh')
  public async refresh(
    @Body() token: RefreshTokenDto,
  ): Promise<IUserAuthResponse> {
    return await this.authService.refresh(token.refreshToken);
  }
}
