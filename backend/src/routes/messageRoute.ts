import { Router } from 'express';
import {getMessagesForChannel, getMessagesForServer, sendMessageInServer} from "../controllers/messageController";
import {isAuthenticated} from "../middlewares/authMiddleware";

const messageRoute:Router = Router();

messageRoute.post('/messages/:serverId/:channelId', isAuthenticated, sendMessageInServer);
messageRoute.get('/messages/:serverId', isAuthenticated, getMessagesForServer);

// This will get messages for a specific channel
// Only difference is this time it limits amount of messages to 20
messageRoute.get('/messages/channel/:channelId', isAuthenticated, getMessagesForChannel);

export default messageRoute;
