import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectRedis, disconnectRedis } from './libs/redis';
import { closePool } from './db/pg';
import { initializeSchema } from './db/schema';
import signUpRoute from "./routes/signUpRoute";
import expressSession from './libs/express-session';
import loginRoute from "./routes/loginRoute";
import forgotPasswordRoute from "./routes/forgotPasswordRoute";
import recoveryRoute from "./routes/recoveryRoute";
import userRoute from "./routes/userRoutes";
import { createServer } from 'http'; // Add this import
import { initSocketManager } from './libs/socket'; // Add this import

// App Config
dotenv.config();

// Variables
const app: Express = express();
const port = process.env.PORT;

// Create HTTP server (important for Socket.IO)
const server = createServer(app);

// Initialize Socket.IO
const io = initSocketManager(server);

// Middlewares
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(expressSession);

// Test Endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running');
});

// Routes
app.use('/api', signUpRoute);
app.use('/api', loginRoute);
app.use('/api', forgotPasswordRoute);
app.use('/api', recoveryRoute);
app.use('/api', userRoute);

// Server - Use the HTTP server instead of app to listen
server.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);

  await initializeSchema();

  // Connect to Redis
  await connectRedis();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down...');
  await disconnectRedis();
  await closePool();
  server.close(() => {
    console.log('Server closed');
  });
});