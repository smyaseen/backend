import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from 'dtos/user.dto';
import { IUserAuthResponse } from 'interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(userDto: CreateUserDto): Promise<IUserAuthResponse> {
    try {
      Logger.log('Creating user');

      return await this.usersService.create(userDto);
    } catch (err) {
      Logger.log(`Error creating user ${JSON.stringify(err)}`);
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }
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
