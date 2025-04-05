import {Router} from "express";
import {
    checkForgotPassword,
    finishForgotPassword,
    forgotPassword,
    verifyForgotPassword
} from "../controllers/forgotPasswordController";
import {forgotPasswordProtection} from "../middlewares/forgotPasswordMiddleware";

const forgotPasswordRoute:Router = Router();

forgotPasswordRoute.post('/forgotPassword/start', forgotPassword);
forgotPasswordRoute.post('/forgotPassword/verify', verifyForgotPassword);
forgotPasswordRoute.post('/forgotPassword/finish', forgotPasswordProtection, finishForgotPassword);
forgotPasswordRoute.get('/forgotPassword/finish/check', forgotPasswordProtection, checkForgotPassword);

export default forgotPasswordRoute;