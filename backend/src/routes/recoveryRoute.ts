import {Router} from "express";
import {recoveryNewEmail, startRecovery} from "../controllers/recoveryController";
import {protectRecovery} from "../middlewares/recoveryMiddleware";

const recoveryRoute:Router = Router();

recoveryRoute.post('/recovery/start', startRecovery)
recoveryRoute.post('/recovery/new-email', protectRecovery, recoveryNewEmail)

export default recoveryRoute;