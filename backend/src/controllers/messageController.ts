// Those functions will handle the logic of the messages
import { Request, Response } from 'express';
import {getMessagesForChannelById, getMessagesForServerById, sendMessageByChannel} from "../utils/messages";
import {getSocketIO} from "../libs/socket";
import {getAllServerMembers} from "../utils/server";
import {ServerMembers} from "../types/types";

// This get all the messages for a server, Was used for testing
export const getMessagesForServer = async (req: Request, res: Response):Promise<void> => {
    try {
        // Check if user is signed in
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Get the server id from the request
        const serverId:string = req.params.serverId;

        // Get the messages for the server
        const messages = await getMessagesForServerById(serverId);

        res.status(200).json(messages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

// This functions should be limited for performance reasons
// This will also use cursor to limit
export const getMessagesForChannel = async (req: Request, res: Response):Promise<void> => {
    try {
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Get the channel id from the request
        const channelId:string = req.params.channelId;

        // Get the messages for the channel
        const {cursor, limit = 15} = req.query;

        const messages = await getMessagesForChannelById(channelId, cursor as string | null, Number(limit));

        res.status(200).json(messages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const sendMessageInServer  = async (req: Request, res: Response):Promise<void> => {
    try {
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Get the server id and channel id from the request
        const serverId:string = req.params.serverId;
        const channelId:string = req.params.channelId;
        const message:string = req.body.message;
        const userId:string | undefined = req.session.user?.id;

        if(!serverId || !channelId || !message) {
            res.status(400).json({message: 'Bad request'});
            return;
        }

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Get all the users in the server
        const members:ServerMembers[] = await getAllServerMembers(serverId);


        // Send the message to the server
        await sendMessageByChannel(userId, serverId, channelId, message);

        // Emit this to all users in the server
        const io = getSocketIO();

        // Emit the message to all users in the server
        members.forEach(member => {
            io.to(`user:${member.id}`).emit('server:messageSent', {
                channelId,
            });
        })

        res.status(200).json({message: 'Successfully sent to server'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}