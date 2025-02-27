// Those are functions related to Redis(Temporary Database)

// Imports
import 'dotenv/config'
import { createClient } from 'redis';

// Redis Client
export const redis = createClient({
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_PASSWORD!,
    socket: {
        host: process.env.REDIS_HOST!,
        port: parseInt(process.env.REDIS_PORT!)
    }
});

// Connect To Client(Inside index.ts)
export const initRedis :() => Promise<void> = async ():Promise<void> => {
    try {
        await redis.connect();
        console.log('Connected to Redis');
    }
    catch(err){
        console.error('Failed to connect to Redis', err);
    }
}

// Test Function
export function testRedis ():void{
    redis.setEx('test', 10, 'Hello World');
}

export async function storeEmailVerificationCode(email: string, code: string):Promise<void> {


    await redis.setEx('email_verification_code:' + code, 60 * 5, email);
}

export async function lockEmailVerificationCode(email: string):Promise<void> {
    await redis.setEx('lock_email_verification_code:' + email, 60, 'locked');
}

export async function checkIfEmailVerificationCodeLocked(email: string):Promise<boolean> {
    const exists = await redis.exists('lock_email_verification_code:' + email);

    return Boolean(exists);
}