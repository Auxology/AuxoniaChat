// Those are routes related to the signup controller
import express, {type Router} from 'express';
import {signupStart} from "../controllers/signupController.js";

const signupRoute:Router = express.Router();

// Importing the signup controller
signupRoute.post('/signup/start', signupStart)

export {signupRoute}


