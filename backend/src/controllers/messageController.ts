// Those functions will handle the logic of the messages
import { Request, Response } from 'express';
import {getMessagesForServerById} from "../utils/messages";

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