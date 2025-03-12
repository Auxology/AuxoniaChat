import { Router } from 'express';
import {isAuthenticated} from "../middlewares/authMiddleware";
import {getUserProfile, getUserServers} from "../controllers/userController";

const userRoute:Router = Router();

userRoute.get('/user/profile', isAuthenticated, getUserProfile);
userRoute.get('/user/servers', isAuthenticated, getUserServers)

export default userRoute;