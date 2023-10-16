import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { localAuthSignUpDTO, localAuthSignInDTO } from './dto';
import { Payload, RefreshTokenPayload, Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthGuardJWT } from './common/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signUpLocal(@Body() dto: localAuthSignUpDTO): Promise<Tokens> {
    return this.authService.signUpLocal(dto);
  }

  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: localAuthSignInDTO): Promise<Tokens> {
    return this.authService.signInLocal(dto);
  }

  // @UseGuards(AuthGuardJWT)
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user as Payload;
    return this.authService.logout(user.id);
  }

  @UseGuards(AuthGuard('jwt-refreshToken'))
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request): Promise<Tokens> {
    const user = req.user as RefreshTokenPayload;
    return this.authService.refresh(user.id, user.refreshToken);
  }
}
