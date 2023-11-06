import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { localAuthSignUpDTO, localAuthSignInDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private dataProvider: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUpLocal(dto: localAuthSignUpDTO): Promise<Tokens> {
    const isUserAlreadyRegistered = await this.dataProvider.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (isUserAlreadyRegistered) {
      throw new HttpException('CONFLICT', HttpStatus.CONFLICT);
    }

    const hashedPassWord = await this.hash(dto.password);

    const newUser = await this.dataProvider.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        hashedPassWord,
      },
    });

    const tokens = await this.generateTokens(
      newUser.id,
      newUser.email,
      newUser.role,
    );

    await this.updateRefreshTokenInDB(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async signInLocal(dto: localAuthSignInDTO): Promise<Tokens> {
    const { email, password } = dto;

    const user = await this.dataProvider.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isPasswordOK = await bcrypt.compare(password, user.hashedPassWord);

    if (!isPasswordOK) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.updateRefreshTokenInDB(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    await this.dataProvider.users.updateMany({
      where: {
        id: userId,
        NOT: {
          refreshToken: '',
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refresh(id: number, refreshToken: string): Promise<Tokens> {
    const user = await this.dataProvider.users.findUnique({
      where: {
        id,
      },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access denied');

    const refreshTokenMatched = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatched) throw new ForbiddenException('Access denied');

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.updateRefreshTokenInDB(user.id, tokens.refreshToken);

    return tokens;
  }

  async hash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async updateRefreshTokenInDB(id: number, refreshToken: string) {
    let hashedToken = await this.hash(refreshToken);
    await this.dataProvider.users.update({
      where: {
        id,
      },
      data: {
        refreshToken: hashedToken,
      },
    });
  }

  async generateTokens(
    id: number,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const [refreshToken, accessToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: process.env.REFRESHTOKENSECRET,
          expiresIn: 60 * 30, // 30 mins
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          email,
          role,
        },
        {
          secret: process.env.ACCESSTOKENSECRET,
          expiresIn: 60 * 60 * 24 * 7, // 7 Days
        },
      ),
    ]);

    return { refreshToken, accessToken };
  }
}
