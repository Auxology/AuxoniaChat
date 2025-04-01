import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

const onlineUsers = new Map<string, string>();
// Track which users are in which servers for targeted broadcasts
const userServers = new Map<string, string[]>();

// Declare io at the module level
let io: SocketServer;

export function initSocketManager(server: HttpServer) {
    io = new SocketServer(server, {
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
        }

        onlineUsers.set(userId, socket.id);

        // Join user to their personal room for targeted events
        socket.join(`user:${userId}`);
        
        socket.broadcast.emit('user:online', userId);
        socket.emit('users:online', Array.from(onlineUsers.keys()));

        // Handle joining server rooms
        socket.on('join:serverRoom', (serverId) => {
            socket.join(`server:${serverId}`);
            
            // Track which servers this user is in
            const userServerList = userServers.get(userId) || [];
            if (!userServerList.includes(serverId)) {
                userServerList.push(serverId);
                userServers.set(userId, userServerList);
            }
        });

        // Handle sending the messages, through the server room
        socket.on('message', (data) => {
            const { serverId, message } = data;
            socket.to(`server:${serverId}`).emit('message', message);
        });

        socket.on('disconnect', () => {
            onlineUsers.delete(userId);
            userServers.delete(userId);

            socket.broadcast.emit('user:offline', userId);
        });
    });

    return io;
}

// Now this function can access the io variable
export function getSocketIO() {
    if (!io) {
        throw new Error('Socket.io has not been initialized. Call initSocketManager first.');
    }
    return io;
}