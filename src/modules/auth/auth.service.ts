import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from 'dtos/user.dto';
import { RegistrationStatus } from './interfaces/auth.interface';
import { IUserAuthResponse } from 'interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'ACCOUNT_CREATE_SUCCESS',
    };

    try {
      Logger.log('Creating user');
      status.data = await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };

      Logger.log(`Error creating user ${JSON.stringify(err)}`);
    }

    Logger.log(`User created ${JSON.stringify(status)}`);

    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<IUserAuthResponse> {
    const user = await this.usersService.findByLogin(loginUserDto);

    return user;
  }

  async refresh(refreshToken: string): Promise<IUserAuthResponse> {
    const user = await this.usersService.refresh(refreshToken);
    return user;
  }
}
