import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) { }
    async findUserByEmail(email: string) {
      const user = await this.model.findOne({ email });
      return user;
    }

    async insertUser(name: string, email: string, password: string) {
        const newUser = new this.model({
          name,
          email,
          password
        });
        await newUser.save();
        return newUser;
      }
}
