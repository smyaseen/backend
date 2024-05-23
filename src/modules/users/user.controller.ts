import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/user.dto';
import { APP_MESSAGES } from 'utils/constants';
import { responseMessageMetadata } from 'decorators/response-message.decorator';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('update/password')
  @responseMessageMetadata(APP_MESSAGES.USER.SUCCESS_PASSWORD_UPDATED)
  public async updatePassword(
    @Request() req,
    @Body()
    updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(updatePasswordDto, req.user.id);
    return {
      message: 'password_update_success',
    };
  }
}
