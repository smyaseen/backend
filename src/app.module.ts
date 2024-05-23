import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EnvironmentConfigModule } from './config/environment-config/environment-config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [AuthModule, UsersModule, EnvironmentConfigModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
