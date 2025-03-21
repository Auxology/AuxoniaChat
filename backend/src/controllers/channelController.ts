import { Request, Response } from 'express';
import { createNewChannel, getServerChannels, getServerRole } from '../utils/channel';
import { randomUUID } from 'crypto';
import { checkIfUserIsMember, isMember } from '../utils/user';

export const createChannel = async (req: Request, res: Response): Promise<void> => {
    try{
        if(!req.session.isAuthenticated) {
            res.status(401).send('Unauthorized');
            return;
        }

        const userId:string | undefined = req.session.user?.id;

        if(!userId){
            res.status(401).send('Unauthorized');
            return;
        }

        const {serverId, name, description} = req.body;

        if (!serverId || !name || name.trim() === '') {
            res.status(400).json({ message: 'Server ID and channel name are required' });
            return;
        }

        // Check if role of user
        const role = await getServerRole(userId, serverId);

        if(!role){
            res.status(403).send('Forbidden');
            return;
        }

        const channelId:string = randomUUID();

        await createNewChannel({
            id: channelId,
            serverId,
            name,
            description
        });

        res.status(201).json({ id: channelId });
    }
    catch(error){
        console.error('Error creating channel:', error);
        res.status(500).send('Error creating channel');
    }
}

export const getChannels = async (req: Request, res: Response): Promise<void> => {
    try{
        if(!req.session.isAuthenticated) {
            res.status(401).send('Unauthorized');
            return;
        }

        const userId:string | undefined = req.session.user?.id;

        if(!userId){
            res.status(401).send('Unauthorized');
            return;
        }

        const {serverId} = req.params;

        if (!serverId) {
            res.status(400).json({ message: 'Server ID is required' });
            return;
        }

        // Check if user is member of server
        const isMemberOfServer = await checkIfUserIsMember(userId, serverId);

        if(!isMemberOfServer){
            console.log('User is not a member of server');
            res.status(403).send('Forbidden');
            return;
        }

        const channel = await getServerChannels(serverId);

        res.status(200).json(channel);
    }
    catch(error){
        console.error('Error getting channels:', error);
        res.status(500).send('Error getting channels');
    }
}