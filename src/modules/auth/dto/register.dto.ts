import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_MESSAGES, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '../constants/auth.constants';

export class RegisterDto {
    @ApiProperty({
        example: 'dorin_pizzaboy',
        description: 'Numele unic al utilizatorului',
    })
    @IsNotEmpty({ message: AUTH_MESSAGES.VALIDATION.USERNAME_REQUIRED })
    @IsString()
    username: string;

    @ApiProperty({
        example: 'creciun@pizza.com',
        description: 'Adresa de email unică a utilizatorului',
    })
    @IsNotEmpty({ message: AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED })
    @IsEmail({}, { message: AUTH_MESSAGES.VALIDATION.EMAIL_INVALID })
    email: string;

    @ApiProperty({
        example: 'ParolaComplexa123!',
        description: 'Parola puternică (minim 8 caractere, litere mari, mici, cifre/simboluri)',
        minLength: PASSWORD_MIN_LENGTH.REGISTER,
    })
    @IsNotEmpty({ message: AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED })
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH.REGISTER, {
        message: AUTH_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH.replace(
            '{min}',
            PASSWORD_MIN_LENGTH.REGISTER.toString()
        ),
    })
    @Matches(PASSWORD_REGEX, {
        message: AUTH_MESSAGES.VALIDATION.PASSWORD_WEAK,
    })
    password: string;
}