// Those are functions related to Redis(Temporary Database)

// Imports
import 'dotenv/config'
import { createClient } from 'redis';

// Redis Client
const redis = createClient({
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_PASSWORD!,
    socket: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!)
    }
});

// Connect To Client(Inside index.ts)
export const initRedis = async () => {
    try {
        await redis.connect();
        console.log('Connected to Redis');
    }
    catch(err){
        console.error('Failed to connect to Redis', err);
    }
}

// Test Function
export function testRedis (){
    redis.setEx('test', 10, 'Hello World');
}