import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/users.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const user: IUser = req.user;
    const accessToken = await this.authService.createAccessToken(req.user);
    const refreshToken = await this.authService.createRefreshToken();

    await this.userService.updateUser(user?._id, { refreshToken });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    const { _id, name, email } = user;
    return res.json({
      user: {
        _id,
        name,
        email
      },
      accessToken
    })
  }
}
