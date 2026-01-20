import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'Username-ul este obligatoriu' })
    @IsString()
    username: string;

    @IsNotEmpty({ message: 'Email-ul este obligatoriu' })
    @IsEmail({}, { message: 'Te rugăm să introduci o adresă de email validă' })
    email: string;

    @IsNotEmpty({ message: 'Parola este obligatorie' })
    @IsString()
    @MinLength(8, { message: 'Parola trebuie să aibă cel puțin 8 caractere' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Parola este prea slabă (trebuie să conțină litere mari, mici și cifre/simboluri)',
    })
    password: string;
}