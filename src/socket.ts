import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { WsJwtAdapter } from './websocket/ws-jwt.adapter';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { WsJwtAdapter } from './websocket/ws-jwt-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const jwt = app.get(JwtService);
  app.useWebSocketAdapter(new WsJwtAdapter(app as INestApplication, jwt));

  // Optionally disable REST listeners here if you don't want REST on this process
  // e.g. app.getHttpServer() is still used by socket server for upgrades

  await app.listen(process.env.WS_PORT ? Number(process.env.WS_PORT) : 3001);
  console.log('WS server running on port', process.env.WS_PORT || 3001);
}
bootstrap();
