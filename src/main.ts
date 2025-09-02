import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://worktrack.softgoway.in/', // React frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
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

  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
