import { ApiProperty } from '@nestjs/swagger';

export class TokenPairDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT Access Token valid pentru 15 minute',
    })
    accessToken: string;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT Refresh Token valid pentru 7 zile',
    })
    refreshToken: string;
}

export class SafeUserDto {
    @ApiProperty({ example: 'uuid-v4-string' })
    id: string;

    @ApiProperty({ example: 'dorin_pizzaboy' })
    username: string;

    @ApiProperty({ example: 'creciun@pizza.com' })
    email: string;

    @ApiProperty({ example: '2024-01-20T10:30:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2024-01-20T10:30:00Z' })
    updatedAt: Date;
}

export class AuthResponseDto {
    @ApiProperty({ type: TokenPairDto })
    tokens: TokenPairDto;

    @ApiProperty({ type: SafeUserDto })
    user: SafeUserDto; // Folosim clasa pentru a fi un constructor valid
}

export class LogoutResponseDto {
    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: 'Deconectare reușită!' })
    message: string;
}

export class RefreshTokenRequestDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Refresh Token obținut la login/register',
    })
    refreshToken: string;
}