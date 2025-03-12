import { Request, Response } from 'express';
import { getUserProfileById } from '../utils/user';
import { decryptEmail } from '../utils/encrypt';

export const getUserProfile = async (req: Request, res: Response):Promise<void> => {
    try{
        const userId = req.session.user?.id;

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Now get only specific user data
        const userData = await getUserProfileById(userId);

        if(!userData) {
            res.status(404).json({message: 'User not found'});
            return;
        }

        // Decrypt user email
        const decryptedEmail = decryptEmail(userData.email, userData.authTag);

        // Replace email with decrypted email
        userData.email = decryptedEmail;

        res.status(200).json(userData);
    }
    catch (error) {
        console.error(`Error in getUserProfile: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getUserServers = async (req: Request, res: Response):Promise<void> => {
    try{
        // Fixed server data
        // TODO: Replace with actual user servers
        const servers = [
            {
                id: '1',
                name: 'Server 1',
                iconUrl: 'https://ui-avatars.com/api/?name=John+Doe'
            },
            {
                id: '2',
                name: 'Server 2',
                iconUrl: 'https://ui-avatars.com/api/?name=John+Doe'
            },
            {
                id: '3',
                name: 'Server 3',
                iconUrl: 'https://ui-avatars.com/api/?name=John+Doe'
            }
        ];

        res.status(200).json(servers);
    }
    catch(error) {
        console.error(`Error in getUserServers: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}