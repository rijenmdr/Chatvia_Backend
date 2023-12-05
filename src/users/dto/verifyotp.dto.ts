import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyOTPDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty({message: "Please enter valid OTP"})
  otp: string;
}