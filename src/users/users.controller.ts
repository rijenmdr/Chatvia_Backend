import { Controller, Post, Body, Res, HttpStatus, NotFoundException, ConflictException, UseGuards, Get, Req } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { SignupDTO } from './dto/signup.dto';
import { EmailDTO } from './dto/email.dto';
import { VerifyOTPDTO } from './dto/verifyotp.dto';
import { ChangePasswordDTO } from './dto/changepassword.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/signup')
  async registerUser(@Body() reqBody: SignupDTO, @Res() res: Response) {
    const { email, name, password } = reqBody;

    const user = await this.usersService.findUserByEmail(email);

    if (user) {
      throw new ConflictException("Email Address Already Exists.")
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    await this.usersService.insertUser(name, email, hashedPassword);

    return res.status(HttpStatus.CREATED).json({
      message: 'User created successfully',
    });
  }

  @Post('/get-otp')
  async getOTP(@Body() reqBody: EmailDTO, @Res() res: Response) {
    const { email } = reqBody;

    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    await this.usersService.sendOTP(email);

    return res.status(HttpStatus.CREATED).json({
      message: 'OTP has been sent to your email.',
    });
  }

  @Post('/verify-otp')
  async verifyOTP(@Body() reqBody: VerifyOTPDTO, @Res() res: Response) {
    const { email, otp } = reqBody;

    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    const data = await this.usersService.verifyOtp(email, otp);
    return res.json({
      message: "OTP is valid",
      valid: data
    })
  }

  @Post('/change-password')
  async changePassword(@Body() reqBody: ChangePasswordDTO, @Res() res: Response) {
    const { password, email } = reqBody;

    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    await this.usersService.updateUser(user?._id, { password: hashedPassword });
    return res.json({
      message: "Password Changed Successfully",
    })
  }

  @UseGuards(AuthGuard)
  @Get('/get-user-detail')
  async getUserDetail(@Req() req) {
    const { id } = req.user;
    const user = await this.usersService.findUserById(id);
    return user;
  }
}
