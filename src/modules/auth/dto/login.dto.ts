import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Adresa de email nu este validă' })
    @IsNotEmpty({ message: 'Email-ul este obligatoriu' })
    email: string;

    @IsNotEmpty({ message: 'Parola este obligatorie' })
    @MinLength(6, { message: 'Parola trebuie să aibă cel puțin 6 caractere' })
    password: string;
}