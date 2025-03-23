import {Request, Response} from 'express';
import {
    getUserProfileById,
    updateUserProfilePicture,
    updateUsername,
    updatePassword,
    getSessionsById,
    removeSessionId,
    getPasswordHash, updateEmail,
} from '../utils/user';
import {decryptEmail, encryptEmail} from '../utils/encrypt';
import {UserData} from "../types/types";
import {deleteProfilePicture, uploadProfilePicture} from "../libs/cloudinary";
import {usernameInUse} from "../utils/username";
import {generateRandomOTP} from "../utils/codes";
import {
    checkIfUserIsLockedById,
    createPasswordChangeSession, deleteEmailChangeCode,
    deletePasswordChangeCode,
    deletePasswordChangeSession,
    deleteSessions,
    lockoutUserById, storeEmailChangeCode,
    storePasswordChangeCode, verifyEmailChangeCode,
    verifyPasswordChangeCode
} from "../libs/redis";
import {clearPasswordChangeJWT, createPasswordChangeJWT} from "../libs/jwt";
import {hashPassword, validatePassword} from "../utils/password";
import {emailInUse, validateEmail} from "../utils/email";
import {clearCookieWithEmail, createCookieWithEmail} from "../utils/cookies";

export const getUserProfile = async (req: Request, res: Response):Promise<void> => {
    try{
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user.id;

        // Now get only specific user data
        const userData:UserData | null = await getUserProfileById(userId);

        if(!userData) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        // Decrypt user email
        // Replace email with decrypted email
        userData.email = decryptEmail(userData.email, userData.authTag);

        res.status(200).json(userData);
    }
    catch (error) {
        console.error(`Error in getUserProfile: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const changeUserProfilePicture = async (req: Request, res: Response):Promise<void> => {
    try{
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        if(!req.file) {
            res.status(400).json({message: 'Image is required'});
            return;
        }

        const userId:string = req.session.user.id

        const userData:UserData | null = await getUserProfileById(userId);

        if(!userData) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        // Delete old image from cloudinary
        await deleteProfilePicture(userData.avatar_url!);

        // Upload image to cloudinary
        const avatarUrl:string = await uploadProfilePicture(req.file);

        await updateUserProfilePicture(userId, avatarUrl);

        res.status(200).json({message: 'Profile picture updated'});
    }
    catch(error){
        console.error(`Error in changeUserProfilePicture: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const changeUsername = async (req: Request, res: Response):Promise<void> => {
    try{
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user.id;
        const {username} = req.body;

        if(!username || username.trim() === '') {
            res.status(400).json({message: 'Username is required'});
            return;
        }

        // Check if username is already taken
        const isUsernameTaken:boolean = await usernameInUse(username);

        if(isUsernameTaken) {
            res.status(400).json({message: 'Username is already taken'});
            return;
        }

        // Update username
        await updateUsername(userId, username);

        res.status(200).json({message: 'Username updated'});
    }
    catch (error) {
        console.error(`Error in changeUsername: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const requestPasswordChange = async (req:Request, res:Response):Promise<void> => {
    try {
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user.id;

        // Check if user is locked out
        const isLocked:boolean = await checkIfUserIsLockedById(userId);

        if(isLocked) {
            res.status(400).json({message: 'User is locked out for 5 minutes'});
            return;
        }

        // Get users email from database
        const userData:UserData | null = await getUserProfileById(userId);

        if(!userData) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        // Decrypt email
        const email:string = decryptEmail(userData.email, userData.authTag);

        // Generate random code
        const otpCode:string = generateRandomOTP();

        // HERE WE WILL SEND THE CODE TO THE USER VIA EMAIL

        // Store code in redis
        await storePasswordChangeCode(userId, otpCode);

        // Lock out user for 5 minutes
        await lockoutUserById(userId);

        res.status(200).json({message: 'Code sent to email'});
    }
    catch(error) {
        console.error(`Error in requestPasswordChange: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const verifyPasswordChange = async (req:Request, res:Response):Promise<void> => {
    try {
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user.id;

        const {code} = req.body;

        if(!code) {
            res.status(400).json({message: 'Code is required'});
            return;
        }

        // Verify if code is correct
        const iCorrect:boolean = await verifyPasswordChangeCode(userId, code);

        if(!iCorrect) {
            res.status(400).json({message: 'Invalid code'});
            return;
        }

        // Now we create session allowing user to change password
        const sessionToken :string | null = await createPasswordChangeSession(userId);

        if(!sessionToken) {
            res.status(500).json({message: 'Internal server error'});
            return;
        }

        // Create jwt cookie
        createPasswordChangeJWT(userId, sessionToken, res);

        await deletePasswordChangeCode(userId);

        res.status(200).json({message: 'Code verified'});
    }
    catch(error) {
        console.error(`Error in verifyPasswordChange: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const changePassword = async (req:Request, res:Response):Promise<void> => {
    try {
        if(!req.userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.userId;

        const {password} = req.body;

        const isValidPassword:boolean = await validatePassword(password);

        if(!isValidPassword) {
            res.status(400).json({message: 'Invalid password'});
            return;
        }

        // Hash password
        const hashedPassword:string = await hashPassword(password);

        // Check if password is the same as the current password
        const userData:UserData | null = await getUserProfileById(userId);

        if(!userData) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        const passwordHash:string | null = await getPasswordHash(userData.email, userData.authTag)

        if(passwordHash === hashedPassword) {
            res.status(400).json({message: 'Password is the same as the current password'});
            return;
        }
        /// Update password in database
        await updatePassword(userId, hashedPassword);

        // Get rid of all session
        await deletePasswordChangeSession(userId);
        clearPasswordChangeJWT(res);

        const sessionId:string[]= await getSessionsById(userId);

        await deleteSessions(sessionId);
        await removeSessionId(userId, sessionId)

        res.status(200).json({message: 'Password updated'});
    }
    catch(error) {
        console.error(`Error in changePassword: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const requestEmailChange = async (req:Request, res:Response):Promise<void> => {
    try{
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user.id;
        const {email} = req.body;

        // Validate email
        const isValidEmail:boolean = validateEmail(email);

        if(!isValidEmail) {
            res.status(400).json({message: 'Invalid email'});
            return;
        }

        // Check if user is locked out
        const isLocked:boolean = await checkIfUserIsLockedById(userId)

        if(isLocked) {
            res.status(400).json({message: 'User is locked out for 5 minutes'});
            return;
        }

        const {encrypted, authTag} = encryptEmail(email);

        // Check if email is already in use
        const emailIsUsed:boolean = await emailInUse(encrypted);

        if(emailIsUsed) {
            res.status(400).json({message: 'Email is already in use'});
            return;
        }

        // Generate random code
        const otpCode:string = generateRandomOTP()

        // HERE WE WILL SEND THE CODE TO THE USER VIA EMAIL

        // Store code in redis
        await storeEmailChangeCode(email, otpCode);

        // Store new email in cookie
        createCookieWithEmail(res, email);

        // Lockout user
        await lockoutUserById(userId);

        res.status(200).json({message: 'Code sent to email'});
    }
    catch(error) {
        console.error(`Error in requestEmailChange: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const verifyEmailChange = async (req:Request, res:Response):Promise<void> => {
    try{
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user.id;

        if(!req.cookies.user_email) {
            res.status(400).json({message: 'Email is required'});
            return;
        }

        const email:string = req.cookies.user_email;

        const {code} = req.body;

        if(!code) {
            res.status(400).json({message: 'Code is required'});
            return;
        }

        // Verify code
        const isValidCode:boolean = await verifyEmailChangeCode(email, code);

        if(!isValidCode) {
            res.status(400).json({message: 'Invalid code'});
            return;
        }

        // Encrypt new email
        const {encrypted, authTag} = encryptEmail(email);

        const isUsed:boolean = await emailInUse(encrypted);

        if(isUsed) {
            res.status(400).json({message: 'Email is already in use'});
            return;
        }

        // Update email in database
        await updateEmail(userId, encrypted, authTag);

        // Clear the code
        await deleteEmailChangeCode(email);

        // Delete email cookie
        clearCookieWithEmail(res);

        // Get session
        const sessionId:string[]= await getSessionsById(userId);

        // Delete all sessions
        await deleteSessions(sessionId);
        await removeSessionId(userId, sessionId);

        res.status(200).json({message: 'Email updated'});
    }
    catch(error) {
        console.error(`Error in verifyEmailChange: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}
