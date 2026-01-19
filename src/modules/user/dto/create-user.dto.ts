import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username-ul trebuie să fie un șir de caractere' })
  @IsNotEmpty({ message: 'Username-ul este obligatoriu' })
  @MinLength(3, { message: 'Username-ul trebuie să aibă cel puțin 3 caractere' })
  @MaxLength(20, { message: 'Username-ul este prea lung (max 20)' })
  username: string;

  @IsEmail({}, { message: 'Formatul email-ului este invalid' })
  @IsNotEmpty({ message: 'Email-ul este obligatoriu' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Parola este obligatorie' })
  @MinLength(8, { message: 'Parola trebuie să aibă cel puțin 8 caractere' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Parola este prea slabă (trebuie să conțină litere mari, mici și cifre/caractere speciale)',
  })
  password: string;
}