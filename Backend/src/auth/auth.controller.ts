import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { localAuthSignUpDTO, localAuthSignInDTO } from './dto';
import { Payload, RefreshTokenPayload, Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Public, RtGuard } from './common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(@Body() dto: localAuthSignUpDTO, @Res() res: Response) {
    let tokens: Tokens = await this.authService.signUpLocal(dto);

    this.sendCookies(res, tokens);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() dto: localAuthSignInDTO, @Res() res: Response) {
    let tokens = await this.authService.signInLocal(dto);

    this.sendCookies(res, tokens);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user as Payload;
    await this.authService.logout(user.id);
    res.cookie('access_token', '');
    res.cookie('refresh_token', '');
    res.send({ status: 'ok' });
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const user = req.user as RefreshTokenPayload;
    const tokens = await this.authService.refresh(user.id, user.refresh_token);
    this.sendCookies(res, tokens);
  }

  sendCookies(res: Response, tokens: Tokens) {
    let sevenDays = 7 * 24 * 3600 * 1000;
    let thirtyMins = 1800000;
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: false,
      expires: new Date(Date.now() + thirtyMins),
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: false,
      expires: new Date(Date.now() + sevenDays),
    });
    res.send({ status: 'ok' });
  }
}
