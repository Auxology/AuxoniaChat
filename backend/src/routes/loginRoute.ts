import { Router } from 'express';
import {check, login, logout, requestLogin, resendCode, testLogin} from '../controllers/loginController';
import {protectLogin} from "../middlewares/2faMiddleware";

const loginRoute: Router = Router();

loginRoute.post('/login', requestLogin);
loginRoute.post('/login/verify', protectLogin, login);
loginRoute.post('/login/resend', protectLogin, resendCode);  // Fixed typo and added controller
loginRoute.post('/login/verify/check', check);
loginRoute.post('/logout', logout);
loginRoute.post('/login/isAuthenticated', testLogin);

export default loginRoute;