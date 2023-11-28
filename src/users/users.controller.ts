import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import bcrypt from 'bcrypt';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    async registerUser(
        @Body('name') name: string, 
        @Body('email') email: string, 
        @Body('password') password: string,
        @Res() res: Response) {
        const user = await this.usersService.findUserByEmail(email);

        if(user) {
            return res.status(HttpStatus.CONFLICT).json({
                message: "Email Address Already Exists."
            })
        }

        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        await this.usersService.insertUser(name, email, hashedPassword);

        return res.status(HttpStatus.CREATED).json({
            message: "User created successfully" })
    } 

    @Post('/signup')
    async login(
        @Body('name') name: string, 
        @Body('email') email: string, 
        @Body('password') password: string,
        @Res() res: Response) {
        const user = await this.usersService.findUserByEmail(email);

        if(user) {
            return res.status(HttpStatus.CONFLICT).json({
                message: "Email Address Already Exists."
            })
        }

        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        await this.usersService.insertUser(name, email, hashedPassword);

        return res.status(HttpStatus.CREATED).json({
            message: "User created successfully" })
    } 
}
