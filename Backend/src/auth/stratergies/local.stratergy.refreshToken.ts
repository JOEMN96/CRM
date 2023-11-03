import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Users } from '@prisma/client';
import { Payload } from '../types';

@Injectable()
export class localATStratergy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        localATStratergy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.ACCESSTOKENSECRET,
    });
  }

  async validate(payload: Payload) {
    return payload;
  }

  private static extractJWT(req: Request) {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }
}

//  Refresh token strat
@Injectable()
export class localRTStratergy extends PassportStrategy(
  Strategy,
  'jwt-refreshToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        localRTStratergy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.REFRESHTOKENSECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    if (req.cookies && req.cookies.refresh_token) {
      return {
        ...payload,
        refresh_token: req.cookies.refresh_token,
      };
    }
    return null;
  }

  private static extractJWT(req: Request) {
    if (req.cookies && req.cookies.refresh_token) {
      return req.cookies.refresh_token;
    }
    return null;
  }
}
