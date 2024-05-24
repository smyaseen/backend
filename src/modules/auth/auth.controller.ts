import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from 'dtos/user.dto';
import { IUserAuthResponse } from 'interfaces/user.interface';
import { responseMessageMetadata } from 'decorators/response-message.decorator';
import { APP_MESSAGES } from 'utils/constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @responseMessageMetadata(APP_MESSAGES.USER.SUCCESS_PROFILE_CREATED)
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserAuthResponse> {
    const result: IUserAuthResponse =
      await this.authService.register(createUserDto);

    return result;
  }

  @Post('login')
  @responseMessageMetadata(APP_MESSAGES.USER.SUCCESS_PROFILE_LOGIN)
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<IUserAuthResponse> {
    return await this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @responseMessageMetadata(APP_MESSAGES.USER.SUCCESS_REFRESH_TOKEN)
  public async refresh(
    @Body() token: RefreshTokenDto,
  ): Promise<IUserAuthResponse> {
    return await this.authService.refresh(token.refreshToken);
  }
}
