import {Router} from "express";
import {finishRecovery, recoveryNewEmail, startRecovery, verifyNewEmail} from "../controllers/recoveryController";
import {advancedRecoveryProtection, protectRecovery} from "../middlewares/recoveryMiddleware";

const recoveryRoute:Router = Router();

recoveryRoute.post('/recovery/start', startRecovery)
recoveryRoute.post('/recovery/new-email', protectRecovery, recoveryNewEmail)
recoveryRoute.post('/recovery/new-email/verify', protectRecovery, verifyNewEmail)
recoveryRoute.post('/recovery/finish', advancedRecoveryProtection, finishRecovery)

export default recoveryRoute;