import { Router } from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { createChannel, getChannelDetails, getChannels } from '../controllers/channelController';

const channelRoute: Router = Router();

channelRoute.post('/servers/:serverId/channels', isAuthenticated, createChannel);
channelRoute.get('/servers/:serverId/channels/get', isAuthenticated, getChannels);
// This will get specific channel details
channelRoute.get('/servers/:serverId/channels/:channelId', isAuthenticated, getChannelDetails);

export default channelRoute;
