import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdatePasswordDto } from './user.dto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';

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
  async create(userDto: CreateUserDto): Promise<any> {
    const userInDb = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });
    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }
    const newUser = await this.prisma.user.create({
      data: {
        ...userDto,
        role: 'customer' as const,
        password: await hash(userDto.password, 10),
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.name);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return { tokens, user: { name: newUser.name } };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async update(id: string, data: any) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<{
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    user: { name: string };
  }> {
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

    const tokens = await this.getTokens(user.id, user.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens, user: { name: user.name } };
  }

  async findByPayload({ email }: any): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.getJWT_ACCESS_SECRET(),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.getJWT_REFRESH_SECRET(),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
