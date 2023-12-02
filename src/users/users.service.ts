import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schema/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}
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
}
