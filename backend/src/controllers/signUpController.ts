// Those are functions related to signup
import type{ Request, Response } from 'express';
import {emailInUse, validateEmail} from "../utils/email";
import {clearCookieWithEmail, createCookieWithEmail} from "../utils/cookies";
import { encryptEmail } from '../utils/encrypt';
import {
    checkIfUserIsLocked,
    checkTemporarySession,
    createTemporarySession,
    deleteEmailVerificationCode,
    deleteTemporarySession,
    lockoutUser, removeLockout,
    storeEmailVerificationCode,
    verifyEmailVerificationCode
} from "../libs/redis";
import {generateRandomOTP, generateRandomRecoveryCode} from "../utils/codes";
import {sendEmailCode} from "../libs/resend";
import {clearTemporaryJWT, createTemporaryJWT} from "../libs/jwt";
import {usernameInUse, validateUsername} from "../utils/username";
import {hashPassword, validatePassword} from "../utils/password";
import {createUser} from "../utils/user";
import {decodeJWT} from "@oslojs/jwt";

export const signUpStart = async (req: Request, res: Response):Promise<void> => {
    const email:string = req.body.email || req.cookies.user_email;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        // 1. Validate email
        const isValid:boolean = validateEmail(email);

        if(!isValid) {
            res.status(400).json({ error: 'Invalid email' });
            return;
        }

        // 2. Now we can create a cookie with the email
        createCookieWithEmail(res, email);

        // 3. Encrypt
        const {encrypted, authTag} = encryptEmail(email);

        if(!encrypted || !authTag) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // 4. Check if user is locked out
        const isLocked:boolean = await checkIfUserIsLocked(email);

        if(isLocked) {
            res.status(429).json({ error: 'Too many requests' });
            return;
        }

        // Check if email is already in use
        const isUsed:boolean = await emailInUse(encrypted);

        if(isUsed) {
            res.status(409).json({ error: 'Email already in use' });
            return;
        }

        // 5.Check if temp session exists inside Redis
        //Temporary session here means that the user has verified email, so we can't allow anybody to use the same email
        //Unless the temp session is deleted.
        // Also do net let the user finish sign up from here, because if somebody verified their email
        // they should finish sign up from the finish sign up endpoint

        const existingSession:boolean =  await checkTemporarySession(email);

        if(existingSession){
            res.status(409).json({ error: 'Email is already used' });
            return;
        }

        // 6. Create verification Code
        const verificationCode:string = generateRandomOTP();

        await storeEmailVerificationCode(email, verificationCode);

        // 8. Send email with verification code
        await sendEmailCode(email, verificationCode);

        // 9. Lock the email
        await lockoutUser(email);

        res.status(200).json({ message: 'Signup started' });
    }
    catch (err) {
        console.error('Failed to start signup', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const signUpVerify = async (req: Request, res: Response):Promise<void> => {
    const {code} = req.body;
    const email:string = req.cookies.user_email;

    const isValidEmail:boolean= validateEmail(email);

    if(!isValidEmail){
        res.status(400).json({ error: 'Invalid email' });
        return;
    }

    if(!code){
        res.status(400).json({ error: 'Code is required' });
        return;
    }

    try{
        //1. Check if code is valid
        const isValid:boolean = await verifyEmailVerificationCode(email, code);

        if(!isValid){
            res.status(400).json({ error: 'Invalid code' });
            return;
        }

        //2. Delete the code from Redis
        await deleteEmailVerificationCode(email);

        //3. Now we create a temporary session
        const sessionToken: string | null = await createTemporarySession(email);

        if(!sessionToken) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        //4. Create JWT Session
        createTemporaryJWT(email, sessionToken, res);

        //5. Clear the cookie
        clearCookieWithEmail(res);

        res.status(200).json({ message: 'Email verified' });
    }
    catch(err){
        console.error('Failed to verify email', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

export const signUpFinish = async (req: Request, res: Response):Promise<void> => {
    try {
        const email:string = req.email as string;

        if(!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        const {username, password} = req.body;

        //1. Validate username and password
        const isValidUsername:boolean = await validateUsername(username);

        if(!isValidUsername) {
            res.status(400).json({error: 'Invalid username'});
            return;
        }

        const isValidPassword:boolean = await validatePassword(password);

        if(!isValidPassword) {
            res.status(400).json({error: 'Invalid password'});
            return;
        }

        //2. Check if username is already in use

        const isUsed:boolean = await usernameInUse(username);

        if(isUsed) {
            res.status(409).json({error: 'Username already in use'});
            return;
        }

        //3. Hash the password
        const hashedPassword:string = await hashPassword(password);

        //4. Encrypt the email
        const {encrypted, authTag} = encryptEmail(email);

        //5. Generate recovery codes
        const recoveryCodes:string[] = [generateRandomRecoveryCode(),generateRandomRecoveryCode(), generateRandomRecoveryCode()];

        //6. Create User
        await createUser(username, encrypted, authTag, hashedPassword, recoveryCodes);

        //7. Clear the session
        await deleteTemporarySession(email);
        
        //8. Clear the cookies
        clearCookieWithEmail(res);
        clearTemporaryJWT(res);

        //9. Remove Lock
        await removeLockout(email);

        res.status(200).json({ recoveryCodes: recoveryCodes });
    }
    catch (err) {
        console.error('Failed to finish signup', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Checker functions
export const checkVerify = async (req: Request, res: Response):Promise<void> => {
    try{
        const email = req.cookies['user_email'];

        if(!email){
            res.status(400).json({hasEmailPending: false});
            return;
        }

        res.status(200).json({ hasEmailPending: true, email: email });
    }
    catch(err){
        console.error('Failed to verify email', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const checkSignUpFinish = async (req: Request, res: Response):Promise<void> => {
    try {
        const token = req.cookies['temp-session'];

        if(!token) {
            res.status(400).json({ error: 'Unauthorized' });
            return;
        }

        const decoded = decodeJWT(token) as {email: string, sessionToken:string};

        if(!decoded) {
            res.status(400).json({ error: 'Unauthorized' });
            return;
        }

        res.status(200).json({ email: decoded.email });
    }
    catch (err) {
        console.error('Failed to check signup finish', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}