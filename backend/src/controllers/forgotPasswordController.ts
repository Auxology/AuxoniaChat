import { Request, Response } from 'express';
import {encryptEmail} from "../utils/encrypt";
import {getUserByEmail, resetUserPassword} from "../utils/user";
import {validateEmail} from "../utils/email";
import {clearCookieWithEmail, createCookieWithEmail} from "../utils/cookies";
import {generateRandomOTP} from "../utils/codes";
import {
    checkIfUserIsLocked, createForgotPasswordSession, deleteForgotPasswordSession,
    deletePasswordResetCode,
    lockoutUser,
    storePasswordResetCode,
    verifyPasswordResetCode
} from "../libs/redis";
import {sendPasswordResetCode} from "../libs/resend";
import {clearForgotPasswordJWT, createForgotPasswordJWT} from "../libs/jwt";
import {hashPassword, validatePassword} from "../utils/password";

export const forgotPassword = async (req: Request, res: Response):Promise<void> => {
    try {
        const {email} = req.body;

        const isValid:boolean = validateEmail(email);

        if(!isValid) {
            res.status(400).json({ error: 'Invalid email' });
            return;
        }

        // Check if user is locked out
        const isLocked:boolean = await checkIfUserIsLocked(email);

        if(isLocked) {
            res.status(429).json({ error: 'Too many requests' });
            return;
        }

        // Encrypt email
        const { encrypted: encryptedEmail, authTag } = encryptEmail(email);

        // Check if user exists
        const user = await getUserByEmail(encryptedEmail, authTag);

        if(!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Create cookie with email
        createCookieWithEmail(res, email);

        // Create and store verification code in the redis
        const code:string = generateRandomOTP();

        await storePasswordResetCode(email, code);

        // Send email with code
        await sendPasswordResetCode(email, code);

        // Lockout user for 1 minute
        // Yes email verification and password reset code share the same lock
        await lockoutUser(email);

        res.status(200).json({ message: 'Code sent' });
    }
    catch (error) {
        console.error('Internal Server Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const verifyForgotPassword = async (req: Request, res: Response):Promise<void> => {
    const {code} = req.body;
    const email:string = req.cookies.user_email as string;

    // Check if code is provided
    if(!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
    }

    // Check if email is provided
    const isValidEmail:boolean = validateEmail(email);

    if(!isValidEmail) {
        res.status(400).json({ error: 'Invalid email' });
        return;
    }

    try{
        // Check if code is valid
        const isValidCode:boolean = await verifyPasswordResetCode(email, code);

        if(!isValidCode) {
            res.status(400).json({ error: 'Invalid code' });
            return;
        }

        // Delete the code from Redis
        await deletePasswordResetCode(email);

        // Create a temporary session
        const sessionToken:string | null = await createForgotPasswordSession(email);

        if(!sessionToken) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Create jwt cookie
         createForgotPasswordJWT(email, sessionToken, res);

        // Clear the email cookie
        clearCookieWithEmail(res);

        res.status(200).json({ message: 'Code verified' });
    }
    catch (error) {
        console.error('Internal Server Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const finishForgotPassword = async (req: Request, res: Response):Promise<void> => {
    try{
        const email: string = req.email as string;

        const isValidEmail: boolean = validateEmail(email);

        if (!isValidEmail) {
            res.status(400).json({error: 'Invalid email'});
            return;
        }

        // Expect password from the body
        const {password} = req.body;

        if(!password) {
            res.status(400).json({ error: 'Password is required' });
            return
        }

        // Check password
        const isValidPassword: Promise<boolean> = validatePassword(password);

        if (!isValidPassword) {
            res.status(400).json({error: 'Invalid password'});
            return;
        }

        // TODO: Check if password is the same as the old password

        // Hash password
        const hashedPassword: string = await hashPassword(password);


        // Encrypt email
        const {encrypted: encryptedEmail, authTag} = encryptEmail(email);


        // Update user
        await resetUserPassword(encryptedEmail, authTag, hashedPassword);

        // Delete the temporary session
        await deleteForgotPasswordSession(email);
        clearForgotPasswordJWT(res);

        res.status(200).json({message: 'Password Reset Successful'});
    }
    catch (error) {
        console.error('Internal Server Error', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export const checkForgotPassword = async (req: Request, res: Response):Promise<void> => {
    try{
        const token = req.cookies['forgot-password-session'];

        if(!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        res.status(200).json({ message: 'Authorised' });
    }
    catch (error) {
        console.error('Internal Server Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}