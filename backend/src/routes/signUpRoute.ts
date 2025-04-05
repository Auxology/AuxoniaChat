import {Router} from "express";
import {checkSignUpFinish, checkVerify, signUpFinish, signUpStart, signUpVerify} from "../controllers/signUpController";
import {signUpProtection} from "../middlewares/signUpMiddleware";

const signUpRoute:Router = Router()

signUpRoute.post('/signup/start', signUpStart)
signUpRoute.post('/signup/verify', signUpVerify)
signUpRoute.get('/signup/verify/check', checkVerify)
signUpRoute.post('/signup/finish', signUpProtection, signUpFinish)
signUpRoute.get('/signup/finish/check', signUpProtection, checkSignUpFinish)

export default signUpRoute