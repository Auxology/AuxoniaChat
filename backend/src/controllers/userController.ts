import {Request, Response} from 'express';
import {
    createNewServer,
    getAllServerMembers,
    getServersByUserId,
    getUserProfileById,
    isMember,
    getServerByServerId,
    joinServerWithIds,
    updateUserProfilePicture,
    updateUsername,
    updatePassword,
    getSessionsById,
    removeSessionId,
    getPasswordHash
} from '../utils/user';
import {decryptEmail} from '../utils/encrypt';
import {ServerDataForUser, ServerMembers, UserData, UserServers} from "../types/types";
import { } from '../utils/user';
import {uploadProfilePicture} from "../libs/cloudinary";
import {usernameInUse} from "../utils/username";
import {generateRandomOTP} from "../utils/codes";
import {
    checkIfUserIsLockedById,
    createPasswordChangeSession,
    deletePasswordChangeCode,
    deletePasswordChangeSession,
    deleteSessions,
    lockoutUserById,
    storePasswordChangeCode,
    verifyPasswordChangeCode
} from "../libs/redis";
import {clearPasswordChangeJWT, createPasswordChangeJWT} from "../libs/jwt";
import {hashPassword, validatePassword} from "../utils/password";

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

        console.log(userId)

        // Upload image to cloudinary
        const avatarUrl:string = await uploadProfilePicture(req.file);

        console.log(avatarUrl);

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

export const getUserServers = async (req: Request, res: Response):Promise<void> => {
    try{
        const userId:string = req.session.user?.id as string;

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const servers:UserServers[] = await getServersByUserId(userId)

        res.status(200).json(servers);
    }
    catch(error) {
        console.error(`Error in getUserServers: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const createServer = async (req: Request, res: Response):Promise<void> => {
    try{
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user.id;

        const {name, iconUrl} = req.body;

        if (!name || name.trim() === '') {
            res.status(400).json({ message: 'Server name is required' });
            return;
        }

        // In a real application, you would upload the icon to a storage service
        // and store the URL in the database

        const serverId:string = crypto.randomUUID();

        await createNewServer({
            id: serverId,
            name,
            iconUrl:iconUrl || null,
            ownerId: userId
        })

        res.status(200).json({message: 'Server created successfully'});
    }
    catch(error) {
        console.error(`Error in createServer: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getServerById = async (req:Request, res:Response):Promise<void> => {
    try{
        const userId:string =  req.session.user?.id as string;
        const {serverId} = req.params;

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // First check if user is a member of this server
        const rows:ServerDataForUser | null = await isMember(serverId, userId);

        if(!rows) {
            res.status(403).json({message: 'Forbidden'});
            return;
        }

        res.status(200).json(rows);
    }
    catch(error) {
        console.error(`Error in getServer: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getServerMembers = async (req:Request, res:Response):Promise<void> => {
    try{
        const userId:string = req.session.user?.id as string;
        const {serverId} = req.params;

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const rows:ServerDataForUser | null = await isMember(serverId, userId);

        if(!rows) {
            res.status(403).json({message: 'Forbidden'});
            return;
        }

        // Get all members
        const members:ServerMembers[] = await getAllServerMembers(serverId);

        res.status(200).json(members);
    }
    catch(error) {
        console.error(`Error in getServerMembers: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const joinServer = async (req:Request, res:Response):Promise<void> => {
    try{
        const userId:string = req.session.user?.id as string;
        const {serverId} = req.body;

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        if(!serverId) {
            res.status(400).json({message: 'Server id is required'});
            return;
        }
        // Check if server exists
        const serverExists:boolean = await getServerByServerId(serverId);

        if(!serverExists) {
            res.status(404).json({message: 'Server not found'});
            return;
        }

        // Check if user is already a member of this server
        const rows:ServerDataForUser | null = await isMember(serverId, userId);

        if(rows) {
            res.status(400).json({message: 'User already a member of this server'});
            return;
        }

        // Now make the user join the server
        await joinServerWithIds(userId, serverId);

        res.status(200).json({message: 'Joined server'});
    }
    catch (error) {
        console.error(`Error in joinServer: ${error}`);
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