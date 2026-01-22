import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import express from 'express';
import { HttpExceptionCustom } from '../../../infrastructure/exceptions/httpexception-custom';
import { BaseController } from '../../../infrastructure/shared/base.controller';
import { Public } from '../../../infrastructure/shared/base.decorator';
import { LoginAuthDto } from '../dto/login.dto';
import { RegisterAuthDto } from '../dto/register.dto';
import { SendOtpDto } from '../dto/send-otp.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { JwtAuthenticationGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
@UseGuards(JwtAuthenticationGuard)
export class AuthController extends BaseController {
  private readonly _logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private _jwtService: JwtService,
  ) {
    super();
  }

  @Post('login')
  @Public()
  login(@Body() loginDto: LoginAuthDto, @Req() req: express.Request) {
    const device = this.getDeviceInfo(req);

    if (!device.deviceId || !device.deviceType) {
      this._logger.warn('Device information is missing in the request headers');
      throw new HttpExceptionCustom('Request Invalid', 400);
    }

    loginDto.deviceId = device.deviceId;
    loginDto.deviceType = device?.deviceType;

    if (device?.osVersion) loginDto.osVersion = device?.osVersion;

    return this.authService.login(loginDto, device);
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  async logout(@Req() req: express.Request) {
    const device = this.getDeviceInfo(req);
    const user = this.getUserInfo(req);

    if (!user) {
      this._logger.warn('User information is missing in the request');
      throw new HttpExceptionCustom('Unauthorized', 401);
    }

    await this.authService.logout(user, device);
    return { message: 'Logout successful' };
  }

  @Post('verify-otp')
  @Public()
  public async verifyOtp(
    @Body() body: VerifyOtpDto,
    @Req() req: express.Request,
  ) {
    const device = this.getDeviceInfo(req);
    return this.authService.verifyOtp(body, device);
  }

  @Post('send-otp')
  @Public()
  SendOtp(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body);
  }

  @Get('profile')
  getProfile(@Req() req: express.Request) {
    const userInfo = this.getUserInfo(req);

    if (!userInfo) {
      this._logger.warn(
        'User information is missing in the request! Please found reason why.',
      );
      throw new HttpExceptionCustom('Unauthorized', 401);
    }

    return this.authService.getProfile(userInfo);
  }

  @Post('refresh')
  @Public()
  refreshToken(
    @Req() req: express.Request,
    @Body() body: { refreshToken: string },
  ) {
    const device = this.getDeviceInfo(req);

    if (!device.deviceId) {
      this._logger.warn('Device information is missing in the request');
      throw new HttpExceptionCustom('Device information required', 400);
    }

    try {
      const user = this._jwtService.verify(body.refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      return this.authService.refreshToken(user, device, body.refreshToken);
    } catch (error) {
      this._logger.warn('Invalid refresh token', error);
      throw new HttpExceptionCustom('Invalid or expired refresh token', 401);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }
}
