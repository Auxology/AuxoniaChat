import {Request, Response} from 'express';
import {createNewServer, getServersByUserId, getUserProfileById} from '../utils/user';
import {decryptEmail} from '../utils/encrypt';
import {UserData} from "../types/types";

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

export const getUserServers = async (req: Request, res: Response):Promise<void> => {
    try{
        const userId:string = req.session.user?.id as string;

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const servers = await getServersByUserId(userId)

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