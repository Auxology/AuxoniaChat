import { Request, Response } from 'express';
import {getUserByRecoveryCode, recoverAccount, removeSessionId} from "../utils/user";
import {
    checkIfUserIsLocked, checkRecoverySession, createAdvancedRecoverySession,
    createRecoverySession, deleteAdvancedRecoverySession, deleteNewEmailCode, deleteRecoverySession, deleteSessions,
    lockoutUser,
    storeNewEmailCode, verifyAdvancedRecoverySession,
    verifyNewEmailCode
} from "../libs/redis";
import {clearAdvancedRecoveryJWT, clearRecoveryJWT, createAdvancedRecoveryJWT, createRecoveryJWT} from "../libs/jwt";
import {emailInUse, validateEmail} from "../utils/email";
import {encryptEmail} from "../utils/encrypt";
import {generateRandomOTP} from "../utils/codes";
import {clearCookieWithEmail, createCookieWithEmail} from "../utils/cookies";
import {hashPassword, validatePassword} from "../utils/password";
import {decodeJWT} from "@oslojs/jwt";

export const startRecovery = async (req: Request, res: Response):Promise<void> => {
    try{
        const {recoveryCode} = req.body;

        if(!recoveryCode){
            res.status(400).json({message: 'Recovery code is required'});
            return;
        }

        //1. Search for the user with the recovery code
        const userId:string | null = await getUserByRecoveryCode(recoveryCode);


        if(!userId){
            res.status(404).json({message: 'User not found with this recovery code'});
            return;
        }

        //2. Create a recovery session
        const sessionToken:string | null = await createRecoverySession(userId);

        if(!sessionToken) {
            res.status(500).json({message: 'Internal server error'});
            return;
        }

        //3. Create jwt token
        createRecoveryJWT(userId, sessionToken, res);

        res.status(200).json({ message: 'Account recovery started' });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const recoveryNewEmail = async (req: Request, res: Response):Promise<void> => {
    try{
        const {email} = req.body;

        const isValidEmail:boolean = validateEmail(email);

        if(!isValidEmail){
            res.status(400).json({message: 'Invalid email'});
            return;
        }

        // Check if email is locked
        const emailLocked:boolean = await checkIfUserIsLocked(email);

        if(emailLocked){
            res.status(400).json({message: 'Email is locked'});
            return;
        }

        // Encrypt email
        const {encrypted, authTag} = encryptEmail(email);

        // Check if email is in use
        const emailUsed:boolean = await emailInUse(encrypted);

        if(emailUsed){
            res.status(400).json({message: 'Email already in use'});
            return;
        }

        // Generate code
        const code:string = generateRandomOTP();

        // Store recovery code
        await storeNewEmailCode(email, code);

        // Create cookie with email
        createCookieWithEmail(res, email);

        // Lock user
        await lockoutUser(email);

        res.status(200).json({message: 'New email code sent'});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const verifyNewEmail = async (req: Request, res: Response):Promise<void> => {
    try{
        const code:string = req.body.code;
        const email:string = req.cookies['user_email'];
        const userId:string | undefined = req.userId;

        if(!code){
            res.status(400).json({message: 'Code is required'});
            return;
        }

        const isValidEmail:boolean = validateEmail(email);

        if(!isValidEmail){
            res.status(400).json({message: 'Invalid email'});
            return;
        }

        if(!userId){
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Verify code
        const isValidCode:boolean = await verifyNewEmailCode(email, code);

        if(!isValidCode){
            res.status(400).json({message: 'Invalid code'});
            return;
        }

        // Delete code
        await deleteNewEmailCode(email);

        // Delete old session
        await deleteRecoverySession(userId);
        clearRecoveryJWT(res);

        // Create new session
        const sessionToken:string | null = await createAdvancedRecoverySession(email, userId);

        if(!sessionToken){
            res.status(500).json({message: 'Internal server error'});
            return;
        }

        createAdvancedRecoveryJWT(email, userId, sessionToken, res);

        // Clear new email cookie
        clearCookieWithEmail(res);

        res.status(200).json({message: 'Email verified'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const finishRecovery = async (req: Request, res: Response):Promise<void> => {
    try{
        const password = req.body.password;
        const email:string | undefined = req.email;
        const userId:string | undefined  = req.userId;

        if(!email) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Check if password is valid
        const isValidPassword:boolean = await validatePassword(password);

        if(!isValidPassword){
            res.status(400).json({message: 'Invalid password'});
            return;
        }

        // Validate email
        const isValidEmail:boolean = validateEmail(email);

        if(!isValidEmail) {
            res.status(400).json({message: 'Invalid email'});
            return;
        }

        // Encrypt email and hash password
        const {encrypted, authTag} = encryptEmail(email);
        const hashedPassword:string = await hashPassword(password);

        // Recheck if email is in use
        const emailIsUsed:boolean = await emailInUse(encrypted);

        if(emailIsUsed){
            res.status(400).json({message: 'Email already in use'});
            return;
        }

        // Recover account
        // This will also return session ids
        const sessionToken:string[] = await recoverAccount(userId, encrypted, authTag, hashedPassword);

        // Delete old session
        await deleteAdvancedRecoverySession(email);
        clearRecoveryJWT(res);
        clearAdvancedRecoveryJWT(res);

        // Destroy session
        await deleteSessions(sessionToken);

        // Now get rid of the session ids inside of pg database
        await removeSessionId(userId,sessionToken);

        res.status(200).json({message: 'Account recovered'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const checkRecoveryProtection = async (req: Request, res: Response):Promise<void> => {
    try{
        const token = req.cookies['recovery-session'];

        if(!token) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const decoded = decodeJWT(token) as {userId: string, sessionToken:string};

        if(!decoded){
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const isValid:boolean = await checkRecoverySession(decoded.userId, decoded.sessionToken);

        if(!isValid){
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        res.status(200).json({message: 'Authorized'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}


export const checkAdvancedRecoveryProtection = async (req: Request, res: Response):Promise<void> => {
    try{
        const token = req.cookies['advanced-recovery-session'];

        if (!token) {
            res.status(401).json({error: 'Unauthorized'});
            return;
        }

        //2. Decode jwt token
        const decoded = decodeJWT(token) as {email:string, userId: string, sessionToken:string};

        if (!decoded) {
            res.status(401).json({error: 'Unauthorized'});
            return;
        }

        //3. Verify recovery session
        const isValid:boolean = await verifyAdvancedRecoverySession(decoded.email ,decoded.userId, decoded.sessionToken);

        if (!isValid) {
            res.status(401).json({error: 'Unauthorized'});
            return;
        }

        res.status(200).json({message: 'Authorized'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}