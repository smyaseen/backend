import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/user.dto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { Prisma, Role, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { CreateUserDto, LoginUserDto } from 'dtos/user.dto';
import { IUserAuthResponse } from 'interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: EnvironmentConfigService,
  ) {}

  async updatePassword(payload: UpdatePasswordDto, id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    const areEqual = await compare(payload.old_password, user.password);
    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    return await this.prisma.user.update({
      where: { id },
      data: { password: await hash(payload.new_password, 10) },
    });
  }

  async create(userDto: CreateUserDto): Promise<IUserAuthResponse> {
    const userInDb = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });
    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }
    const newUser = await this.prisma.user.create({
      data: {
        ...userDto,
        role: Role.customer,
        password: await hash(userDto.password, 10),
      },
    });

    const tokens = await this.getTokens(newUser.id, {
      username: newUser.name,
      role: newUser.role,
    });
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return { tokens, user: { name: newUser.name, role: newUser.role } };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.update(userId, {
      refreshToken,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findByLogin({
    email,
    password,
  }: LoginUserDto): Promise<IUserAuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.getTokens(user.id, {
      username: user.name,
      role: user.role,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens, user: { name: user.name, role: user.role } };
  }

  async findByPayload(findByData: Prisma.UserWhereInput): Promise<any> {
    return await this.prisma.user.findFirst({
      where: findByData,
    });
  }

  async getTokens(
    userId: string,
    { username, role }: { username: string; role: string },
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.getJWT_ACCESS_SECRET(),
          expiresIn: '10m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.getJWT_REFRESH_SECRET(),
          expiresIn: '20m',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<IUserAuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.getTokens(user.id, {
      username: user.name,
      role: user.role,
    });

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens, user: { name: user.name, role: user.role } };
  }
}
