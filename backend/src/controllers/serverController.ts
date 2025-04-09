import { Request, Response } from 'express';
import {
    createNewServer,
    deleteServerWithId,
    getAllServerMembers,
    getServerByServerId,
    getServersByUserId,
    isMember,
    leaveServerWithIds,
    searchServersByName,
    hasPendingJoinRequest,
    createJoinRequest,
    getJoinRequestsByServerId,
    approveJoinRequestById,
    rejectJoinRequestById,
    getJoinRequetsById,
    getServersWhereUserHasElevatedRole,
    getIncomingJoinRequestsByServerId,
    getServerBasicDetails,
    getServerAdmins,
    updateServerNameById, updateServerIconById
} from '../utils/server';
import { ServerDataForUser, ServerMembers, UserServers } from '../types/types';
import {uploadServerImage} from "../libs/cloudinary";
import { getSocketIO } from '../libs/socket';

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

        // Get all members of the server
        const members:ServerMembers[] = await getAllServerMembers(serverId);

        const io = getSocketIO();
        // Notify all members of the server
        members.forEach(member => {
            io.to(`user:${member.id}`).emit('server:memberLeft', {
                userId,
                serverId
            });
        });

        res.status(200).json({message: 'Left server'});
    }
    catch(error) {
        console.error(`Error in leaveServer: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

// Keep in mind this will delete the server for all users
// Only the owner of the server should be able to delete the server
export const deleteServer = async (req:Request, res:Response):Promise<void> => {
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

        // Check if user is the owner of this server
        const members = await getAllServerMembers(serverId); // This will return all members of the server

        const isOwner = members.find(member => member.id === userId && member.role === 'owner');

        if(!isOwner) {
            res.status(403).json({message: 'Forbidden'});
            return;
        }

        // Now delete the server
        await deleteServerWithId(serverId);

        const io = getSocketIO();

        // Notify all members of the server
        members.forEach(member => {
            io.to(`user:${member.id}`).emit('server:deleted', {
                serverId
            });
        });

        res.status(200).json({message: 'Server deleted'});
    }
    catch(error) {
        console.error(`Error in deleteServer: ${error}`);
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

// Reqeust to join a server
export const requestJoinServer = async (req:Request, res:Response):Promise<void> => {
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

        // Check if server exists
        const serverExists:boolean = await getServerByServerId(serverId);

        if(!serverExists) {
            res.status(404).json({message: 'Server not found'});
            return;
        }

        // Check if user is already a member of this server
        const isMemberOfServer = await isMember(serverId, userId);

        if(isMemberOfServer) {
            res.status(400).json({message: 'User already a member of this server'});
            return;
        }

        // Check if there is already a request pending
        const hasPending = await hasPendingJoinRequest(userId, serverId);

        if(hasPending) {
            res.status(400).json({message: 'Request already pending'});
            return;
        }

        // Create join request
        await createJoinRequest(userId, serverId);

        // Server details
        const serverDetails = await getServerBasicDetails(serverId);

        // Get all admin/owner of the server
        const admins = await getServerAdmins(serverId);

        // Emit ithe event to all admins
        const io = getSocketIO();
        admins.forEach(adminId => {
            io.to(`user:${adminId}`).emit('server:joinRequest', {
                requestId: /* generate or retrieve the request ID */
                userId,
                serverId,
                serverName: serverDetails.name,
                username: req.session.user?.username
            });
        });

        res.status(200).json({message: 'Request sent'});
    }
    catch(error) {
        console.error(`Error in requestJoinServer: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

// Get all pending requests
export const getServerJoinRequests = async (req:Request, res:Response):Promise<void> => {
    try{
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId = req.session.user?.id as string;
        const {serverId} = req.params;

        if(!serverId) {
            res.status(400).json({message: 'Server id is required'});
            return;
        }

        // Check if user is an admin or owner of this server
        const members =  await getAllServerMembers(serverId);
        const isAdminOrOwner = members.find(member => member.id === userId && (member.role === 'owner' || member.role === 'admin'));

        if(!isAdminOrOwner) {
            res.status(403).json({message: 'Forbidden'});
            return;
        }

        // Get join requests
        const request = await getJoinRequestsByServerId(serverId);

        res.status(200).json(request);
    }
    catch(error) {
        console.error(`Error in getServerMembers: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

// Approve join request
export const approveJoinRequest = async (req:Request, res:Response):Promise<void> => {
    try{

        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId:string = req.session.user?.id as string;
        const {serverId, requestId} = req.body;

        if(!serverId || !requestId) {
            res.status(400).json({message: 'Server id and request id is required'});
            return;
        }

        // Check if user is an admin or owner of this server
        const members =  await getAllServerMembers(serverId);
        const isAdminOrOwner = members.find(member => member.id === userId && (member.role === 'owner' || member.role === 'admin'));

        if(!isAdminOrOwner) {
            res.status(403).json({message: 'Forbidden'});
            return;
        }

        // Approve join request
        const result = await approveJoinRequestById(requestId);

        if(!result) {
            res.status(404).json({message: 'Request not found'});
            return;
        }

        // Get server details
        const serverDetails = await getServerBasicDetails(serverId);

        const io = getSocketIO();

        // Notify the user
        io.to(`user:${result.userId}`).emit('server:joinApproved', {
            serverId,
            serverDetails
        });

        // Notify all members of the server
        members.forEach(member => {
            io.to(`user:${member.id}`).emit('server:joinApproved', {
                serverId,
                serverDetails
            });
        });

        //Send name of server from this api
        const serverName = serverDetails.name;
        res.status(200).json({serverName});
    }
    catch(error) {
        console.error(`Error in approveJoinRequest: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

// Reject a join request
export const rejectJoinRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.session.user?.id as string;
        const { requestId, serverId } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!requestId || !serverId) {
            res.status(400).json({ message: 'Request ID and Server ID are required' });
            return;
        }

        // Check if user is an admin or owner of the server
        const members = await getAllServerMembers(serverId);
        const isAdminOrOwner = members.some(m => 
            m.id === userId && (m.role === 'owner' || m.role === 'admin')
        );

        if (!isAdminOrOwner) {
            res.status(403).json({ message: 'Only server admins can reject join requests' });
            return;
        }

        // Reject the request
        const result = await rejectJoinRequestById(requestId);
        
        if (!result) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }

        // Get server details
        const serverDetails = await getServerBasicDetails(serverId);

        const io = getSocketIO();

        // Notify the user
        io.to(`user:${result.userId}`).emit('server:joinRequestRejected', {
            serverId,
            serverDetails
        });

        // Notify admins
        const admins = await getServerAdmins(serverId);
        admins.forEach(adminId => {
            io.to(`user:${adminId}`).emit('server:joinRequestRejected', {
                serverId,
                serverDetails
            });
        });

        // Send name of server from this api
        // For usage in socket
        const serverName = serverDetails.name;
        res.status(200).json({serverName});
    } catch (error) {
        console.error(`Error in rejectJoinRequest: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// This will retrive all requests sent by the user
export const getSentJoinRequests = async (req: Request, res: Response): Promise<void> => {
    try{
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId = req.session.user?.id as string;

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Get all requests sent by the user
        const requests = await getJoinRequetsById(userId);

        res.status(200).json(requests);
    }
    catch(error) {
        console.error(`Error in getSentJoinRequests: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

// This will get all incoming join requests for servers where the user is admin/owner
export const getIncomingJoinRequests = async (req: Request, res: Response): Promise<void> => {
    try{
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userId = req.session.user?.id as string;

        if(!userId) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        // Get all servers where the user is an admin or owner
        const serverIds = await getServersWhereUserHasElevatedRole(userId);

        // Get all join requests for these servers
        const requests = await getIncomingJoinRequestsByServerId(serverIds);

        res.status(200).json(requests);
    }
    catch(error) {
        console.error(`Error in getIncomingJoinRequests: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

// This function will patch the server(Updating Name in this case)
export const updateServerName = async (req:Request, res:Response):Promise<void> => {
    try {
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const serverId = req.body.serverId;

        if(!serverId) {
            res.status(400).json({message: 'Server id is required'});
            return;
        }

        const userId = req.session.user?.id as string;

        // Check if user is an owner of this server
        const serverMembers:ServerMembers[] = await getAllServerMembers(serverId);

        const isOwner:ServerMembers|undefined = serverMembers.find(member => member.id === userId && member.role === 'owner');

        if(!isOwner) {
            res.status(403).json({message: 'Forbidden'});
        }

        // Update server name
        const newName = req.body.name;

        if(!newName || newName.trim() === '') {
            res.status(400).json({message: 'Server name is required'});
            return;
        }

        // Check if the new name is different from the old name
        const serverDetails = await getServerBasicDetails(serverId);

        if(serverDetails.name === newName) {
            res.status(400).json({message: 'Server name is the same'});
            return;
        }

        await updateServerNameById(serverId, newName);

        // Emit the event to all members of the server
        const io = getSocketIO();
        serverMembers.forEach(member => {
            io.to(`user:${member.id}`).emit('server:nameUpdated', {
                serverId,
                newName
            });
        });

        res.status(200).json({message: 'Server name updated successfully'});
    }
    catch(error) {
        console.error(`Error in updateServerName: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const updateServerIcon = async (req:Request, res:Response):Promise<void> => {
    try {
        if(!req.session.isAuthenticated) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const serverId = req.body.serverId;

        if(!serverId) {
            res.status(400).json({message: 'Server id is required'});
            return;
        }

        const userId = req.session.user?.id as string;

        // Check if user is an owner of this server
        const serverMembers:ServerMembers[] = await getAllServerMembers(serverId);

        const isOwner:ServerMembers|undefined = serverMembers.find(member => member.id === userId && member.role === 'owner');

        if(!isOwner) {
            res.status(403).json({message: 'Forbidden'});
        }

        // Check if file is provided
        if(!req.file) {
            res.status(400).json({message: 'File is required'});
            return;
        }

        // Upload the new icon
        const iconUrl:string = await uploadServerImage(req.file);

        // Update server icon
        await updateServerIconById(serverId, iconUrl);

        const io = getSocketIO();

        serverMembers.forEach(member => {
            io.to(`user:${member.id}`).emit('server:iconUpdated', {
                serverId,
                iconUrl
            });
        })

        res.status(200).json({message: 'Server icon updated successfully'});
    }
    catch(error) {
        console.error(`Error in updateServerIcon: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}