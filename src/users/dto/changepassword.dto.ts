import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDTO {
    @IsEmail()
    email: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message:
            'Password must be minimum of eight characters, atleast one letter, one number and one special character.',
    })
    password: string;

    @IsString()
    // @Matches('password')
    confirmPassword: string;
}
