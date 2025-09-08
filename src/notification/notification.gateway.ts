import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
   origin: 'https://worktrack.softgoway.in', // your frontend URL
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const { user_id, company_id } = client.handshake.query;
    if (user_id) client.join(`user_${user_id}`);
    if (company_id) client.join(`company_${company_id}`);
    console.log(`Client connected: ${client.id}, user: ${user_id}, company: ${company_id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitToUser(user_id: string, entity: any) {
    this.server.to(`user_${user_id}`).emit('notification', entity);
  }

  emitToCompany(company_id: string, payload: any) {
    this.server.to(`company_${company_id}`).emit('notification', payload);
  }
}
