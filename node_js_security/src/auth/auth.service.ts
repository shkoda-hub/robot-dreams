import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async loginWithEmailAndPassword(signInDto: Record<string, any>) {
    const { email, password } = signInDto;

    return await this.validateUser(email, password);
  }

  async loginWithBasicHeader(header: string) {
    const [prefix, token] = header.split(' ');
    if (prefix !== 'Basic') {
      throw new UnauthorizedException('Invalid email or password');
    }

    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [email, password] = decoded.split(':');

    return await this.validateUser(email, password);
  }

  async refreshToken(refreshTokenDto: Record<string, string>) {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );
      const user = await this.usersService.findOne(payload.email);
      if (!user) throw new UnauthorizedException('Invalid token');

      return {
        accessToken: await this.jwtService.signAsync(
          { sub: user.id, email: user.email, roles: user.roles },
          {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: '5m',
          },
        ),
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '5m',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
      user: payload,
    };
  }
}
