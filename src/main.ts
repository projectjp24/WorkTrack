import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.enableCors({
    origin: 'http://localhost:5173', // React frontend origin
    credentials: true,  
  });

 

  const config = new DocumentBuilder()
    .setTitle('WorkTrack API')
    .setDescription('WorkTrack API description')
    .setVersion('1.0')
    .addBearerAuth({
      type : 'http',
      scheme : 'bearer',
      bearerFormat : 'JWT',
      name : 'JWT',
      description : 'Enter JWT Token',
      in : 'header'
    }, 'JWT-auth')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT Token',
      in: 'header'
    }, 'JWT-refresh')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, documentFactory);

    app.useGlobalPipes(new ValidationPipe({
  whitelist: true, 
  forbidNonWhitelisted: false,
  transform: true,
  skipMissingProperties: false,
}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
