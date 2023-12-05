import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { UpdateUserInput } from './users.type';
@Injectable()
export class UsersService {
  private twilioClient: Twilio;

  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private readonly configService: ConfigService
  ) {
    const accountSid = configService.get(process.env.TWILIO_ACCOUNT_SID);
    const authToken = configService.get(process.env.TWILIO_AUTH_TOKEN);

    this.twilioClient = new Twilio(accountSid, authToken);
  }
  
  async findUserByEmail(email: string) {
    const user = await this.model.findOne({ email });
    return user;
  }

  async insertUser(name: string, email: string, password: string) {
    const newUser = new this.model({
      name,
      email,
      password,
    });
    await newUser.save();
    return newUser;
  }

  async validateUser(email: string, passport: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(passport, user?.password);

    if (!isValidPassword) {
      return null;
    }
    return user;
  }

  async sendOTP(email: string) {
    try {
      const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;

      const res = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verifications.create({ to: email, channel: 'email' })
      console.log(res)
      return res;
    } catch (error) {
      throw new HttpException(error?.message || 'OTP verification failed', error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;
      const verification = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: email, code: otp });

      return verification;
    } catch (error) {
      throw new HttpException(error?.message || 'OTP verification failed', error?.status || HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string, user: UpdateUserInput) {
    const updatedUser = await this.model.updateOne({ _id: id }, { $set: user })
    return updatedUser;
  }
}
