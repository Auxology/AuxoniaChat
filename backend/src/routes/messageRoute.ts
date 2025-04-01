import { Router } from 'express';
import {getMessagesForServer} from "../controllers/messageController";
import {isAuthenticated} from "../middlewares/authMiddleware";

const messageRoute:Router = Router();

messageRoute.get('/messages/:serverId', isAuthenticated, getMessagesForServer);


export default messageRoute;
