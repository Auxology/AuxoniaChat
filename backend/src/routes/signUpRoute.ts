import {Router} from "express";
import {signUpFinish, signUpStart, signUpVerify} from "../controllers/signUpController";
import {signUpProtection} from "../middlewares/signUpMiddleware";

const signUpRoute:Router = Router()

signUpRoute.post('/signup/start', signUpStart)
signUpRoute.post('/signup/verify', signUpVerify)
signUpRoute.post('/signup/finish', signUpProtection, signUpFinish)

export default signUpRoute