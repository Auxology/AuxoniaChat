import { Router } from 'express';
import {isAuthenticated} from "../middlewares/authMiddleware";
import {getUserProfile, getUserServers, createServer} from "../controllers/userController";

const userRoute:Router = Router();

userRoute.get('/user/profile', isAuthenticated, getUserProfile);
userRoute.get('/user/servers', isAuthenticated, getUserServers)
userRoute.post('/user/servers/create', isAuthenticated, createServer)

export default userRoute;