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
import { Public, Role, Roles } from './common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signUpLocal(@Body() dto: localAuthSignUpDTO): Promise<Tokens> {
    return this.authService.signUpLocal(dto);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: localAuthSignInDTO): Promise<Tokens> {
    return this.authService.signInLocal(dto);
  }

  // @Roles(Role.USER)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user as Payload;
    return this.authService.logout(user.id);
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refreshToken'))
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request): Promise<Tokens> {
    const user = req.user as RefreshTokenPayload;
    return this.authService.refresh(user.id, user.refreshToken);
  }
}
