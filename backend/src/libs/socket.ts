import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

const onlineUsers = new Map<string, string>();

export function initSocketManager(server: HttpServer) {
    const io = new SocketServer(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.auth.userId;

        if(!userId) {
            socket.disconnect();
            return;
        } // Fixed the newline here

        console.log('User connected', userId);

        onlineUsers.set(userId, socket.id);

        socket.broadcast.emit('user:online', userId);

        socket.emit('users:online', Array.from(onlineUsers.keys()))

        socket.on('disconnect', () => {
            console.log('User disconnected', userId);
            onlineUsers.delete(userId);

            socket.broadcast.emit('user:offline', userId);
        });
    });

    return io;
}