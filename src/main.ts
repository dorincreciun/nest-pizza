import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global Validation Pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // elimină proprietăți nedefinite în DTO
            forbidNonWhitelisted: true, // aruncă eroare dacă sunt proprietăți nedefinite
            transform: true, // transformă automat tipurile
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle('API Autentificare')
        .setDescription('Documentație API pentru modulul de autentificare')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
                description: 'Introdu JWT token-ul (se va adăuga automat prefixul Bearer)',
                in: 'header',
            },
            'access-token', // acest nume trebuie să corespundă cu @ApiBearerAuth() din controller
        )
        .addTag('Autentificare', 'Endpoints pentru login, register, logout, refresh token')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true, // păstrează token-ul între refresh-uri
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
        customSiteTitle: 'API Docs - Autentificare',
    });

    await app.listen(3000);

    console.log(`🚀 Aplicație pornită pe: http://localhost:3000`);
    console.log(`📚 Swagger UI disponibil la: http://localhost:3000/api/docs`);
}

bootstrap();