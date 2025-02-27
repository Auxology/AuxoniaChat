// Those are functions related to signup
import type{ Request, Response } from 'express';
import {emailInUse, validateEmail} from "../utils/email.js";
import {createCookieWithEmail} from "../utils/cookies.js";
import { encryptEmail } from '../utils/encrypt.js';
import {
    checkIfEmailVerificationCodeLocked,
    lockEmailVerificationCode,
    storeEmailVerificationCode
} from "../libs/redis.js";
import {generateRandomOTP} from "../utils/codes.js";
import {sendEmailCode} from "../libs/resend.js";

export const signupStart = async (req: Request, res: Response):Promise<void> => {
    const email: string = req.body.email;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        // 1. Validate email
        const isValid = validateEmail(email);

        if(!isValid) {
            res.status(400).json({ error: 'Invalid email' });
            return;
        }

        // 2. Now we can create a cookie with the email
        createCookieWithEmail(res, email);

        // 3. Encrypt
        const {encrypted, authTag} = encryptEmail(email);

        // 4. Check if user is locked out
        const isLocked = await checkIfEmailVerificationCodeLocked(email);

        if(isLocked) {
            res.status(429).json({ error: 'Too many requests' });
            return;
        }

        // Check if email is already in use
        const isUsed = await emailInUse(encrypted);

        if(isUsed) {
            res.status(409).json({ error: 'Email already in use' });
            return;
        }

        // 5.Check if temp session exists inside Redis
        //Temporary session here means that the user has verified email, so we can't allow anybody to use the same email
        //Unless the temp session is deleted.
        // Also do net let the user finish sign up from here, because if somebody verified their email
        // they should finish sign up from the finish sign up endpoint

        // const existingSession =  await checkIfTemporarySessionExists(email);

        // if(existingSession){
        //    res.status(409).json({ error: 'Email is already used' });
        //    return;
        //}

        // 6. Create verification Code
        const verificationCode = generateRandomOTP();

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