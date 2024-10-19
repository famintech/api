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

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.authService.createPasswordResetToken(email);
    return { message: 'Password reset email sent' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password reset successful' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/generate')
  async generateTwoFactor(@Request() req) {
    const { secret, otpauthUrl, qrCode } = await this.authService.generateTwoFactorSecret(req.user.userId);
    return { secret, otpauthUrl, qrCode };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/enable')
  async enableTwoFactor(@Request() req, @Body('token') token: string) {
    const isEnabled = await this.authService.enableTwoFactor(req.user.userId, token);
    if (isEnabled) {
      return { message: 'Two-factor authentication enabled' };
    }
    throw new UnauthorizedException('Invalid token');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/disable')
  async disableTwoFactor(@Request() req) {
    await this.authService.disableTwoFactor(req.user.userId);
    return { message: 'Two-factor authentication disabled' };
  }

  @Post('2fa/verify')
  async verifyTwoFactor(@Body('userId') userId: string, @Body('token') token: string) {
    const isValid = await this.authService.verifyTwoFactorToken(userId, token);
    if (isValid) {
      const user = await this.authService.findUserById(userId);
      return this.authService.generateTokens(user);
    }
    throw new UnauthorizedException('Invalid token');
  }
}