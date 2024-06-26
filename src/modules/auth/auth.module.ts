import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { AccessTokenStrategy } from './jwt/accessToken.strategy';
import { RefreshTokenStrategy } from './jwt/refreshToken.strategy';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
