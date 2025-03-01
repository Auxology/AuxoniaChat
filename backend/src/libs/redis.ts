import { createClient } from 'redis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Redis client
const redisClient = createClient({
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_PASSWORD!,
    socket: {
        host: process.env.REDIS_HOST!,
        port: 19945
    }
});

// Connection event handlers
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('connect', ():void => console.log('Redis: Connection established'));
redisClient.on('ready', ():void => console.log('Redis: Client is ready'));
redisClient.on('reconnecting', ():void => console.log('Redis: Reconnecting...'));

// Connect to Redis
const connectRedis : () => Promise<void> = async (): Promise<void> => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

// Disconnect from Redis
const disconnectRedis : () => Promise<void> = async (): Promise<void> => {
    try {
        await redisClient.disconnect();
        console.log('Redis: Disconnected');
    } catch (error) {
        console.error('Error disconnecting from Redis:', error);
    }
};

export { redisClient, connectRedis, disconnectRedis };

// Redis Functions

export async function storeEmailVerificationCode(email: string, code: string):Promise<void> {


    await redisClient.setEx('email_verification_code:' + email, 60 * 5, code);
}


export async function verifyEmailVerificationCode(email: string, code: string):Promise<boolean> {
    const storedCode = await redisClient.get('email_verification_code:' + email);

    return code === storedCode;
}

export async function deleteEmailVerificationCode(email: string):Promise<void> {
    await redisClient.del('email_verification_code:' + email);
}

export const createTemporarySession = async (email: string):Promise<string | null> => {
    const sessionToken = crypto.randomUUID();
    // 10 Minute expiration
    const expiration = 60 * 10;

    const payload = {
        email,
        sessionToken,
        expiresIn: expiration,
    }

    const existingSession:string | null = await redisClient.get(`temp_session:${email}`);

    if(existingSession){
        await redisClient.del(`temp_session:${email}`);
    }

    await redisClient.setEx(`temp_session:${email}`, expiration, JSON.stringify(payload));

    return sessionToken;
}

export const checkTemporarySession = async (email: string):Promise<boolean> => {
    const tempSession = await redisClient.exists(`temp_session:${email}`);

    return Boolean(tempSession);
}

export const deleteTemporarySession = async (email: string):Promise<void> => {
    await redisClient.del(`temp_session:${email}`);
}

export async function lockEmailVerificationCode(email: string):Promise<void> {
    await redisClient.setEx('lock_email_verification_code:' + email, 60, 'locked');
}

export async function checkIfEmailVerificationCodeLocked(email: string):Promise<boolean> {
    const exists = await redisClient.exists('lock_email_verification_code:' + email);

    return Boolean(exists);
}