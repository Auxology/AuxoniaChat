import { Router } from 'express';
import {getMessagesForChannel, getMessagesForServer, sendMessageInServer} from "../controllers/messageController";
import {isAuthenticated} from "../middlewares/authMiddleware";

const messageRoute:Router = Router();

messageRoute.post('/messages/:serverId/:channelId', isAuthenticated, sendMessageInServer);
messageRoute.get('/messages/:serverId', isAuthenticated, getMessagesForServer);
messageRoute.get('/messages/channel/:channelId', isAuthenticated, getMessagesForChannel);

export default messageRoute;
