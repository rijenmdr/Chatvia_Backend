import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.type';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser> {
    return await this.usersService.validateUser(email, password);
  }

  async createAccessToken(user: IUser) {
    const payload = { email: user.email, id: user._id };
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(): Promise<string> {
    const tokenId = randomUUID();
    return this.jwtService.sign({ tokenId: tokenId }, { expiresIn: '7d' });
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret : process.env.JWT_SECRET_KEY
  });
  }
}
