import { Router } from 'express';
import {isAuthenticated} from "../middlewares/authMiddleware";
import {
    getUserProfile,
    getUserServers,
    createServer,
    getServerById,
    getServerMembers,
    joinServer
} from "../controllers/userController";

const userRoute:Router = Router();

userRoute.get('/user/profile', isAuthenticated, getUserProfile);
userRoute.get('/user/servers', isAuthenticated, getUserServers)
userRoute.post('/user/servers/create', isAuthenticated, createServer);
userRoute.get('/user/servers/:serverId', isAuthenticated, getServerById);
userRoute.get('/user/servers/:serverId/members', isAuthenticated, getServerMembers);
userRoute.post('/user/servers/join', isAuthenticated, joinServer);


export default userRoute;