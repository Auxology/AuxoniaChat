// Purpose: Entry point for the backend server.

// Imports
import express, {type Express} from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {testRoute} from "./routes/testRoute.js";
import {initRedis} from "./libs/redis.js";

dotenv.config();

// Constants
const app:Express = express();
const port:string = process.env.PORT!;

if(!port) {
    console.error('PORT not defined in .env file');
    process.exit(1);
}

// Middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api', testRoute); // Test route(Do not worry about this)

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