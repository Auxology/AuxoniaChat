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

export const verifyTemporarySession = async (email: string, sessionToken:string):Promise<boolean> => {
    const session:string | null = await redisClient.get(`temp_session:${email}`);

    if(!session){
        return false;
    }

    const sessionData = JSON.parse(session);

    return sessionData.sessionToken === sessionToken;
}

export const deleteTemporarySession = async (email: string):Promise<void> => {
    await redisClient.del(`temp_session:${email}`);
}

export async function storePasswordResetCode(email: string, code: string):Promise<void> {
    await redisClient.setEx('password_reset_code:' + email, 60 * 5, code);
}

export async function verifyPasswordResetCode(email: string, code: string):Promise<boolean> {
    const storedCode:string | null = await redisClient.get('password_reset_code:' + email);

    return code === storedCode;
}

export async function deletePasswordResetCode(email: string):Promise<void> {
    await redisClient.del('password_reset_code:' + email);
}

export async function createForgotPasswordSession(email: string):Promise<string| null> {
    const sessionToken = crypto.randomUUID();
    // 10 Minute expiration
    const expiration = 60 * 10;

    const payload = {
        email,
        sessionToken,
        expiresIn: expiration,
    }

    const existingSession:string | null = await redisClient.get(`forgot_password_session:${email}`);

    if(existingSession){
        await redisClient.del(`forgot_password_session:${email}`);
    }

    await redisClient.setEx(`forgot_password_session:${email}`, expiration, JSON.stringify(payload));

    return sessionToken;
}

export async function checkForgotPasswordSession(email: string, sessionToken: string):Promise<boolean> {
    const session:string | null = await redisClient.get(`forgot_password_session:${email}`);

    if(!session){
        return false;
    }

    const sessionData = JSON.parse(session);

    return sessionData.sessionToken === sessionToken;
}

export async function deleteForgotPasswordSession(email: string):Promise<void> {
    await redisClient.del(`forgot_password_session:${email}`);
}

export async function createRecoverySession(userId:string) : Promise<string | null> {
    const sessionToken = crypto.randomUUID();
    // 10 Minute expiration
    const expiration = 60 * 10;

    const payload = {
        userId,
        sessionToken,
        expiresIn: expiration,
    }

    const existingSession:string | null = await redisClient.get(`recovery_session:${userId}`);

    if(existingSession){
        await redisClient.del(`recovery_session:${userId}`);
    }

    await redisClient.setEx(`recovery_session:${userId}`, expiration, JSON.stringify(payload));

    return sessionToken;
}

export async function checkRecoverySession(email: string, sessionToken: string):Promise<boolean> {
    const session:string | null = await redisClient.get(`recovery_session:${email}`);

    if(!session){
        return false;
    }

    const sessionData = JSON.parse(session);

    return sessionData.sessionToken === sessionToken;
}

export async function deleteRecoverySession(email: string):Promise<void> {
    await redisClient.del(`recovery_session:${email}`);
}

export async function storeNewEmailCode(email: string, code: string):Promise<void> {
    await redisClient.setEx('new_email_code:' + email, 60 * 5, code);
}

export async function verifyNewEmailCode(email: string, code: string):Promise<boolean> {
    const storedCode:string | null = await redisClient.get('new_email_code:' + email);

    return code === storedCode;
}

export async function deleteNewEmailCode(email: string):Promise<void> {
    await redisClient.del('new_email_code:' + email);
}

export async function createAdvancedRecoverySession(email: string, userId:string):Promise<string | null> {
    const sessionToken = crypto.randomUUID();
    // 10 Minute expiration
    const expiration = 60 * 10;

    const payload = {
        email,
        sessionToken,
        userId,
        expiresIn: expiration,
    }

    const existingSession:string | null = await redisClient.get(`advanced_recovery_session:${email}`);

    if(existingSession){
        await redisClient.del(`advanced_recovery_session:${email}`);
    }

    await redisClient.setEx(`advanced_recovery_session:${email}`, expiration, JSON.stringify(payload));

    return sessionToken;
}

export async function verifyAdvancedRecoverySession(email: string,userId:string, sessionToken: string):Promise<boolean> {
    const session:string | null = await redisClient.get(`advanced_recovery_session:${email}`);

    if(!session){
        return false;
    }

    const sessionData = JSON.parse(session);

    return sessionData.sessionToken === sessionToken && sessionData.userId === userId;
}

export async function deleteAdvancedRecoverySession(email: string):Promise<void> {
    await redisClient.del(`advanced_recovery_session:${email}`);
}

export async function lockoutUser(email: string):Promise<void> {
    await redisClient.setEx('lock_email_verification_code:' + email, 60, 'locked');
}

export async function checkIfUserIsLocked(email: string):Promise<boolean> {
    const exists = await redisClient.exists('lock_email_verification_code:' + email);

    return Boolean(exists);
}

// This function should expect array of session ids and should delete all of them
export async function deleteSessions(sessionIds: string[]):Promise<void> {
    for(const sessionId of sessionIds){
        await redisClient.del(`auxonia_sess:${sessionId}`);
    }
}