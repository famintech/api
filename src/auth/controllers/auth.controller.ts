import { Controller, Post, UseGuards, Request, Body, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    try {
      const accessToken = await this.authService.refreshAccessToken(refreshToken);
      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Body('refresh_token') refreshToken: string) {
    await this.authService.revokeRefreshToken(refreshToken);
    return { message: 'Logout successful' };
  }
}