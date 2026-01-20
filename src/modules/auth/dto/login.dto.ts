import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_MESSAGES, PASSWORD_MIN_LENGTH } from '../constants/auth.constants';

export class LoginDto {
    @ApiProperty({
        example: 'creciun@pizza.com',
        description: 'Adresa de email a utilizatorului',
    })
    @IsEmail({}, { message: AUTH_MESSAGES.VALIDATION.EMAIL_INVALID })
    @IsNotEmpty({ message: AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED })
    email: string;

    @ApiProperty({
        example: 'ParolaComplexa123!',
        description: 'Parola utilizatorului',
        minLength: PASSWORD_MIN_LENGTH.LOGIN,
    })
    @IsNotEmpty({ message: AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED })
    @MinLength(PASSWORD_MIN_LENGTH.LOGIN, {
        message: AUTH_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH.replace(
            '{min}',
            PASSWORD_MIN_LENGTH.LOGIN.toString()
        ),
    })
    password: string;
}