import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EnvironmentConfigModule } from './config/environment-config/environment-config.module';

@Module({
  imports: [AuthModule, UsersModule, EnvironmentConfigModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
