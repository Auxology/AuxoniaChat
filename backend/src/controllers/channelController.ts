import { Request, Response } from 'express';
import { createNewChannel, getChannelDetailsById, getServerChannels, getServerRole } from '../utils/channel';
import { randomUUID } from 'crypto';
import {checkIfUserIsMember, getAllServerMembers} from '../utils/server';
import {ServerMembers} from "../types/types";
import {getSocketIO} from "../libs/socket";

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
        const role:string | null = await getServerRole(userId, serverId);

        if(!role){
            res.status(403).send('Forbidden');
            return;
        }

        const members: ServerMembers[] = await getAllServerMembers(serverId);

        const channelId:string = randomUUID();

        await createNewChannel({
            id: channelId,
            serverId,
            name,
            description
        });

        // Send notification to all members of the server
        const io = getSocketIO();
        // Notify all members of the server
        members.forEach(member => {
            io.to(`user:${member.id}`).emit('server:channelCreated', {
                userId,
                serverId,
                channelId,
            });
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
        const isMemberOfServer:boolean = await checkIfUserIsMember(userId, serverId);

        if(!isMemberOfServer){
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

export const getChannelDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        if(!req.session.isAuthenticated) {
            res.status(401).send('Unauthorized');
            return;
        }

        const channelId:string = req.params.channelId;

        const details = await getChannelDetailsById(channelId);

        if (!details) {
            res.status(404).send('Channel not found');
            return;
        }

        res.status(200).json(details);
    }
    catch(error) {
        console.error('Error getting channel details:', error);
        res.status(500).send('Error getting channel details');
    }
}