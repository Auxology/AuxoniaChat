import {Router} from "express";
import { signUpStart, signUpVerify } from "../controllers/signUpController";

const signUpRoute:Router = Router()

signUpRoute.post('/signup/start', signUpStart)
signUpRoute.post('/signup/verify', signUpVerify)

export default signUpRoute