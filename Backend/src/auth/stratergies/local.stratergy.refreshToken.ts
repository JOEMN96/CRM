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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESSTOKENSECRET,
    });
  }

  async validate(payload: Payload) {
    return payload;
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESHTOKENSECRET,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: Users) {
    const refreshToken = request
      .get('authorization')
      .replace('Bearer', '')
      .trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
