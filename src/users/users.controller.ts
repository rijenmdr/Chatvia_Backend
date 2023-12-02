import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { SignupDTO } from './dto/signup.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async registerUser(@Body() reqBody: SignupDTO, @Res() res: Response) {
    const { email, name, password } = reqBody;

    const user = await this.usersService.findUserByEmail(email);

    if (user) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Email Address Already Exists.',
      });
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    await this.usersService.insertUser(name, email, hashedPassword);

    return res.status(HttpStatus.CREATED).json({
      message: 'User created successfully',
    });
  }
}
