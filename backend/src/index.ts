// Purpose: Entry point for the backend server.

// Imports from external libraries
import express, {type Express} from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Imports from internal modules
import {testRoute} from "./routes/testRoute.js";
import {initRedis} from "./libs/redis.js";
import {limiter, signUpLimiter} from "./libs/rate-limit.js";
import {signupRoute} from "./routes/signupRoute.js";


// Load environment variables
dotenv.config();

// Constants
const app:Express = express();
const port:string = process.env.PORT!;

// Check if PORT is defined in .env file
if(!port) {
    console.error('PORT not defined in .env file');
    process.exit(1);
}

// Middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }
));


// Routes
app.use('/api', limiter, testRoute); // Test route(Do not worry about this)
app.use('/api', signUpLimiter,signupRoute)


// Server
async function startServer():Promise<void>{
  try {
    await initRedis();
    app.listen(port, ():void => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
  catch(err){
    console.error('Failed to start server', err);
  }
}

startServer().then(():void => {
  console.log('Server started successfully');
}).catch((err):void => {
    console.error('Failed to start server', err);
});