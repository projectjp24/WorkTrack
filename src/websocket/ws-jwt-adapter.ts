import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

export class WsJwtAdapter extends IoAdapter {
  constructor(private app: INestApplication, private jwtService: JwtService) {
    super(app);
  }

  create(port: number, options?: ServerOptions) {
    const server = super.create(port);

    // Middleware for default namespace: validate JWT during handshake
    // @ts-ignore
    server.of('/').use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token
          || socket.handshake.headers?.authorization?.split(' ')[1];
        if (!token) return next(new Error('Unauthorized'));
        const payload = this.jwtService.verify(token);
        // Attach minimal user info to socket.data
        socket.data.user = {
          id: String(payload.sub),
          companyId: String(payload.companyId),
          role: payload.role,
        };
        next();
      } catch (err) {
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }
}
