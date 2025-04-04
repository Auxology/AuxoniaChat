import {Router} from "express";
import {
    checkAdvancedRecoveryProtection,
    checkRecoveryProtection,
    finishRecovery,
    recoveryNewEmail,
    startRecovery,
    verifyNewEmail
} from "../controllers/recoveryController";
import {advancedRecoveryProtection, protectRecovery} from "../middlewares/recoveryMiddleware";

const recoveryRoute:Router = Router();

recoveryRoute.post('/recovery/start', startRecovery)
recoveryRoute.post('/recovery/new-email', protectRecovery, recoveryNewEmail)
recoveryRoute.post('/recovery/new-email/verify', protectRecovery, verifyNewEmail)
recoveryRoute.get('/recovery/new-email/check', protectRecovery, checkRecoveryProtection)
recoveryRoute.post('/recovery/finish', advancedRecoveryProtection, finishRecovery)
recoveryRoute.get('/recovery/finish/check', advancedRecoveryProtection, checkAdvancedRecoveryProtection)

export default recoveryRoute;