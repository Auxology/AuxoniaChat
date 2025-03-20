import { Request, Response } from 'express';
import {decryptEmail, encryptEmail} from "../utils/encrypt";
import {getPasswordHash, getUserByEmail, storeSessionId} from "../utils/user";
import { verifyPassword } from '../utils/password';
import {generateRandomOTP} from "../utils/codes";
import {
    checkIfUserIsLocked, checkTwoFaSession,
    createTwoFaSession,
    lockoutUser,
    storeTwoFactorCode,
    verifyTwoFactorCode
} from "../libs/redis";
import {createCookieWithEmail} from "../utils/cookies";
import {createTwoFaJWT} from "../libs/jwt";
import session from "express-session";
import {decodeJWT} from "@oslojs/jwt";

export const requestLogin = async (req: Request, res: Response):Promise<void> => {
    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    // Check if user is locked
    const isLocked:boolean = await checkIfUserIsLocked(email);

    try{
        //1. Encrypt email to see if it exists
        const { encrypted: encryptedEmail, authTag } = encryptEmail(email);

        //2. Check if email exists
        const user = await getUserByEmail(encryptedEmail, authTag);

        if(!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        //3. Check if password is correct
        // You need to get the password hash from the database
        const hashedPassword:string | null = await getPasswordHash(encryptedEmail, authTag);

        if(!hashedPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Compare the hashed password with the password provided by the user
        const correctPassword:boolean = await verifyPassword(password, hashedPassword);

        if(!correctPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Store 2FA code in redis
        const code:string = generateRandomOTP();

        await storeTwoFactorCode(email, code);
        createCookieWithEmail(res, email);

        // Create Temporary Session
        const sessionToken:string | null = await createTwoFaSession(email)

        if(!sessionToken) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        createTwoFaJWT(email, sessionToken, res)

        // HERE: Send the code to the user's email

        await lockoutUser(email);

        res.status(200).json({ message: '2Fa code sent to email' });
    }
    catch(err){
        console.error('Failed to log in', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const resendCode = async (req: Request, res: Response):Promise<void> => {
    try{
        const email = req.email

        if(!email) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Check if user is locked
        const isLocked:boolean = await checkIfUserIsLocked(email);

        if(isLocked) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Generate a new code
        const code:string = generateRandomOTP();

        // Store the new code
        await storeTwoFactorCode(email, code);

        // HERE: Send the code to the user's email

        await lockoutUser(email);
        res.status(200).json({ message: 'Code resent' });
    }
    catch(err) {
        console.error('Failed to resend code', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const login = async (req: Request, res: Response):Promise<void> => {
    try{
        if(!req.cookies.user_email) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const {code} = req.body;

        if(!code) {
            res.status(400).json({ error: 'Code is required' });
            return;
        }

        const email:string = req.cookies.user_email

        // Now verify the code
        const isCorrect:boolean = await verifyTwoFactorCode(email, code);

        if(!isCorrect) {
            res.status(401).json({ error: 'Invalid code' });
            return;
        }

        // Get user info
        const { encrypted: encryptedEmail, authTag } = encryptEmail(email);

        const user = await getUserByEmail(encryptedEmail, authTag);

        if(!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        //4. Store user info in session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: email,
        }

        req.session.isAuthenticated = true;

        //5. Store sess inside pg
        await storeSessionId(req.session.user.id, req.session.id)

        res.status(200).json({ message: 'Logged in successfully' });
    }
    catch(err) {
        console.error('Failed to log in', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const logout = async (req: Request, res: Response):Promise<void> => {
    res.clearCookie('auxonia_sid');

    req.session.destroy((err):void => {
        if(err) {
            console.error('Failed to log out', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(200).json({ message: 'Logged out successfully' });
    });
}

export const testLogin = async (req: Request, res: Response):Promise<void> => {
    // Check if user is authenticated directly without middleware
    if(req.session && req.session.isAuthenticated) {
        res.status(200).json({ isAuthenticated: true });
    } else {
        // This shouldn't be an error, just a status indicator
        res.status(200).json({ isAuthenticated: false });
    }
}

// Controller function
export const check = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies['2fa-session'];

        if (!token) {
            res.status(401).json({error: 'Unauthorized'});
            return;
        }

        //2. Decode jwt token
        const decoded = decodeJWT(token) as {email: string, sessionToken:string};

        if (!decoded) {
            res.status(401).json({error: 'Unauthorized'});
            return;
        }

        //3. Verify 2fa session
        const isValidSession:boolean = await checkTwoFaSession(decoded.email, decoded.sessionToken);

        if (!isValidSession) {
            res.status(401).json({error: 'Unauthorized'});
            return;
        }

        res.status(200).json({message: 'Authorized'});
    }
    catch(err) {
        console.error('Failed to check login', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
};