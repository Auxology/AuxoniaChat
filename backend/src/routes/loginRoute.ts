import { Router } from 'express';
import {login, logout, testLogin} from '../controllers/loginController';
import {isAuthenticated} from "../middlewares/authMiddleware";

const loginRoute: Router = Router();

loginRoute.post('/login', login);
loginRoute.post('/logout', logout);
loginRoute.post('/login/isAuthenticated', isAuthenticated, testLogin);

export default loginRoute;