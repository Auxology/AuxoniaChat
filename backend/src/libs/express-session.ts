import session from 'express-session';
import {RedisStore} from 'connect-redis';
import { redisClient } from './redis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "auxonia_sess:"
});

// Configure session with Redis store
const expressSession = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  name: 'auxonia_sid',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
});

export default expressSession;