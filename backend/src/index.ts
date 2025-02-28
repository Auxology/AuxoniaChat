import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectRedis, disconnectRedis } from './libs/redis';
import { closePool } from './db/pg';
import { initializeSchema } from './db/schema';
import signUpRoute from "./routes/signUpRoute";

// App Config
dotenv.config();

// Variables
const app: Express = express();
const port = process.env.PORT;

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Test Endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running');
});

// Routes
app.use('/api', signUpRoute)

// Server
const server = app.listen(port, async () => {
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