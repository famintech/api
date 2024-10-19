import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    if (user.isTwoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        userId: user.id,
      };
    }
  
    return this.generateTokens(user);
  }
  
  public async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);
  
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const expiresIn = this.configService.get<number>('JWT_REFRESH_EXPIRATION');
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await this.prisma.refreshToken.create({
      data: {
        token,
        expiresAt,
        userId,
      },
    });

    return token;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { email: token.user.email, sub: token.user.id };
    return this.jwtService.sign(payload);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { token } });
  }

  async createPasswordResetToken(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
  
    const resetToken = uuidv4();
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now
  
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: resetToken, passwordResetExpires },
    });
  
    const resetLink = `https://siren.famin.cloud/reset-password/${resetToken}`;
  
    // Send email asynchronously
    this.sendPasswordResetEmail(user.email, resetLink).catch(error => {
      console.error('Failed to send password reset email:', error);
    });
  }
  
  private async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset',
        template: 'password-reset',
        context: {
          resetLink,
        },
      });
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  async generateTwoFactorSecret(userId: string): Promise<{ secret: string; otpauthUrl: string; qrCode: string }> {
    const secret = speakeasy.generateSecret({ name: 'siren' });
    const otpauthUrl = secret.otpauth_url;
    const qrCode = await qrcode.toDataURL(otpauthUrl);
  
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });
  
    return { secret: secret.base32, otpauthUrl, qrCode };
  }
  
  async verifyTwoFactorToken(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      return false;
    }
  
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });
  }
  
  async enableTwoFactor(userId: string, token: string): Promise<boolean> {
    const isValid = await this.verifyTwoFactorToken(userId, token);
    if (isValid) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { isTwoFactorEnabled: true },
      });
      return true;
    }
    return false;
  }
  
  async disableTwoFactor(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: false, twoFactorSecret: null },
    });
  }
}