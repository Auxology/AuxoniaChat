import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { createChannel, getChannels } from '../controllers/channelController';

const channelRoute: Router = Router();

channelRoute.post('/servers/:serverId/channels', isAuthenticated, createChannel);
channelRoute.get('/servers/:serverId/channels/get', isAuthenticated, getChannels);

export default channelRoute;
