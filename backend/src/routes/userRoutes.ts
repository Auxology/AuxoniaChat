import { Router } from 'express';
import {isAuthenticated} from "../middlewares/authMiddleware";
import {getUserProfile} from "../controllers/userController";

const userRoute:Router = Router();

userRoute.get('/user/profile', isAuthenticated, getUserProfile);

export default userRoute;