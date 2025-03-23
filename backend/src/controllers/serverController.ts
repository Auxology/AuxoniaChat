import { Request, Response } from 'express';
import { createNewServer, getAllServerMembers, getServerByServerId, getServersByUserId, isMember, joinServerWithIds, leaveServerWithIds, searchServersByName } from '../utils/server';
import { ServerDataForUser, ServerMembers, UserServers } from '../types/types';
import {uploadServerImage} from "../libs/cloudinary";

// This will retrive servers that user is in
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

// This will create server
export const createServer = async (req: Request, res: Response):Promise<void> => {
    try{
        if(!req.session.user?.id) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user.id;

        const {name} = req.body;


        if (!name || name.trim() === '') {
            res.status(400).json({ message: 'Server name is required' });
            return;
        }

        // Also expect file with image
        // Do not throw error if no file is provided
        const iconUrl:string | undefined = req.file ? await uploadServerImage(req.file) : undefined;

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

//This will get server by id
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

// This will get all members of a server
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

export const leaveServer = async (req:Request, res:Response):Promise<void> => {
    try{
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId = req.session.user?.id as string;
        const {serverId} = req.body;

        if(!serverId) {
            res.status(400).json({message: 'Server id is required'});
            return;
        }

        // Check if user is a member of this server
        const rows:ServerDataForUser | null = await isMember(serverId, userId);
        if(!rows) {
            res.status(403).json({message: 'Forbidden'});
            return;
        }

        // Now make the user leave the server
        await leaveServerWithIds(userId, serverId);

        res.status(200).json({message: 'Left server'});
    }
    catch(error) {
        console.error(`Error in leaveServer: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const searchServers = async (req:Request, res:Response):Promise<void> => {
    try {
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const searchTerm = req.query.q as string;

        if(!searchTerm || searchTerm.trim() === '') {
            res.status(400).json({message: 'Search term is required'});
            return;
        }

        // This will also pass userId becasue we want to exclude the servers that user is already a member of
        const server = await searchServersByName(req.session.user?.id!, searchTerm);
        res.status(200).json(server);
    }
    catch(error) {
        console.error(`Error in searchServers: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}