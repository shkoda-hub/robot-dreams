import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import { JwtPayload } from './types/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Headers('authorization') authorization: string | undefined,
    @Body() signIdDto: Record<string, any>,
  ) {
    if (authorization) {
      return await this.authService.loginWithBasicHeader(authorization);
    }

    return await this.authService.loginWithEmailAndPassword(signIdDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: Record<string, string>) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@CurrentUser() currentUser: JwtPayload) {
    return currentUser;
  }
}
