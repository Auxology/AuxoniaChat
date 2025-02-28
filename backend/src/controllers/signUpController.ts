// Those are functions related to signup
import type{ Request, Response } from 'express';
import {emailInUse, validateEmail} from "../utils/email";
import {clearCookieWithEmail, createCookieWithEmail} from "../utils/cookies";
import { encryptEmail } from '../utils/encrypt';
import {
    checkIfEmailVerificationCodeLocked, checkTemporarySession, createTemporarySession, deleteEmailVerificationCode,
    lockEmailVerificationCode,
    storeEmailVerificationCode, verifyEmailVerificationCode
} from "../libs/redis";
import {generateRandomOTP} from "../utils/codes";
import {sendEmailCode} from "../libs/resend";
import {createTemporaryJWT} from "../libs/jwt";

export const signUpStart = async (req: Request, res: Response):Promise<void> => {
    const email: string = req.body.email;

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

        // 4. Check if user is locked out
        const isLocked:boolean = await checkIfEmailVerificationCodeLocked(email);

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
        await lockEmailVerificationCode(email);

        res.status(200).json({ message: 'Signup started' });
    }
    catch (err) {
        console.error('Failed to start signup', err);
        return;
    }
}

export const signUpVerify = async (req: Request, res: Response):Promise<void> => {
    const {code} = req.body;
    const email:string = req.cookies.user_email;

    if(!email || !code) {
        res.status(400).json({ error: 'Email and code are required' });
        return;
    }

    try{
        //1. Check if code is valid
        const isValid:boolean = await verifyEmailVerificationCode(email, code);

        console.log(isValid);

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

        //4. Clear the cookie
        clearCookieWithEmail(res);

        //5. Create JWT Session
        createTemporaryJWT(email, sessionToken, res);

        res.status(200).json({ message: 'Email verified' });
    }
    catch(err){
        console.error('Failed to verify email', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}