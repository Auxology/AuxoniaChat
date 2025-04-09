import { query } from '../db/pg';
import { UserServers, ServerData, ServerDataForUser, ServerMembers } from '../types/types';

// All functions related to servers
export async function getServersByUserId(userId: string):Promise<UserServers[]>{
    try {
        const { rows } = await query(`
            SELECT s.id, s.name, s.icon_url as "iconUrl", sm.role, s.owner_id as "ownerId"
            FROM app.servers s
            JOIN app.server_members sm ON s.id = sm.server_id
            WHERE sm.user_id = $1
            ORDER BY s.name
        `, [userId]);

        return rows as UserServers[];
    } catch (error) {
        console.error('Error getting servers for user:', error);
        throw error;
    }
}

// This will create new server

export async function createNewServer(serverData: ServerData): Promise<void> {
    try {
        // Insert server into database
        await query(`
            INSERT INTO app.servers (id, name, icon_url, owner_id)
            VALUES ($1, $2, $3, $4)
        `, [serverData.id, serverData.name, serverData.iconUrl, serverData.ownerId]);

        // Add the owner as a member of the server
        await query(`
            INSERT INTO app.server_members (server_id, user_id, role)
            VALUES ($1, $2, 'owner')
        `, [serverData.id, serverData.ownerId]);
    } catch (error) {
        console.error('Error creating server:', error);
        throw error;
    }
}

export async function isMember(serverId: string, userId: string): Promise<ServerDataForUser| null> {
    try {
        const { rows } = await query(`
            SELECT s.id, s.name, s.icon_url as "iconUrl"
            FROM app.servers s
            JOIN app.server_members sm ON s.id = sm.server_id
            WHERE s.id = $1 AND sm.user_id = $2
        `, [serverId, userId]);

        return rows[0] as ServerDataForUser;
    } catch (error) {
        console.error('Error checking if user is member:', error);
        throw error;
    }
}


export async function getAllServerMembers(serverId: string): Promise<ServerMembers[]> {
    try {
        const { rows } = await query(`
            SELECT u.id, u.username, u.avatar_url, sm.role
            FROM app.users u
            JOIN app.server_members sm ON u.id = sm.user_id
            WHERE sm.server_id = $1
            ORDER BY 
              CASE 
                WHEN sm.role = 'owner' THEN 1
                WHEN sm.role = 'admin' THEN 2
                ELSE 3
              END,
              u.username
          `, [serverId]);      

        return rows as ServerMembers[];
    } catch (error) {
        console.error('Error getting server members:', error);
        throw error;
    }
}

// This function will get the server data by server id
export async function getServerByServerId(serverId: string): Promise<boolean> {
    try {
        const { rows } = await query(`
            SELECT id
            FROM app.servers
            WHERE id = $1
        `, [serverId]);

        if (rows && rows.length > 0) {
            return true;
        }

        return false; // No server found with this ID
    } catch (error) {
        console.error('Error getting server by id:', error);
        throw error;
    }
}

export async function joinServerWithIds(userId: string, serverId: string): Promise<void> {
    try {
        await query(`
            INSERT INTO app.server_members (server_id, user_id, role)
            VALUES ($1, $2, 'member')
        `, [serverId, userId]);
    } catch (error) {
        console.error('Error joining server:', error);
        throw error;
    }
}


// This just checks if the user is a member of the server
export async function checkIfUserIsMember(userId: string, serverId: string): Promise<boolean> {
    try {
        const { rows } = await query(`
            SELECT user_id
            FROM app.server_members
            WHERE user_id = $1 AND server_id = $2
        `, [userId, serverId]);

        return rows.length > 0;
    } catch (error) {
        console.error('Error checking if user is member:', error);
        throw error;
    }
}

export async function leaveServerWithIds(userId: string, serverId: string): Promise<void> {
    try {
        await query(`
            DELETE FROM app.server_members
            WHERE user_id = $1 AND server_id = $2
        `, [userId, serverId]);
    } catch (error) {
        console.error('Error leaving server:', error);
        throw error;
    }
}

export async function deleteServerWithId(serverId: string): Promise<void> {
    try {
        // Begin transaction
        await query('BEGIN');

        try{
            // Delete server members
            await query(`
                DELETE FROM app.server_members
                WHERE server_id = $1
            `, [serverId]);

            // Delete all server join requests
            await query(`
                DELETE FROM app.server_join_requests
                WHERE server_id = $1
            `, [serverId]);

            // FIRST delete messages associated with server channels
            await query(`
                DELETE FROM app.messages
                WHERE channel_id IN (
                    SELECT id
                    FROM app.channels
                    WHERE server_id = $1
                )
            `, [serverId]);
            
            // THEN delete the channels 
            await query(`
                DELETE FROM app.channels
                WHERE server_id = $1
            `, [serverId]);
    
            // Finally delete server
            await query(`
                DELETE FROM app.servers
                WHERE id = $1
            `, [serverId]);
    
            // Commit transaction
            await query('COMMIT');
        }
        catch(error){
            // Rollback transaction
            await query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error deleting server:', error);
        throw error;
    }
}

// This function will deal with server search
// This also excludes the servers that the user is already a member of
export async function searchServersByName(userId: string, searchQuery: string): Promise<UserServers[]> {
    try {
        const { rows } = await query(`
            SELECT s.id, s.name, s.icon_url as "iconUrl"
            FROM app.servers s
            WHERE s.name ILIKE $1 AND s.id NOT IN (
                SELECT server_id
                FROM app.server_members
                WHERE user_id = $2
            )
            ORDER BY s.name
        `, [`%${searchQuery}%`, userId]);

        return rows as UserServers[];
    } catch (error) {
        console.error('Error searching for servers:', error);
        throw error;
    }
}

// Check if user already has pending request to join the server
export async function hasPendingJoinRequest(userId:string, serverId:string): Promise<boolean> {
    try {
        const { rows } = await query(`
            SELECT id
            FROM app.server_join_requests
            WHERE user_id = $1 AND server_id = $2
        `, [userId, serverId]);

        return rows.length > 0;
    } catch (error) {
        console.error('Error checking if user has pending request:', error);
        throw error;
    }
}

// This will create joing request
export async function createJoinRequest(userId:string, serverId:string): Promise<void> {
    try {
        await query(`
            INSERT INTO app.server_join_requests (user_id, server_id)
            VALUES ($1, $2)
        `, [userId, serverId]);
    } catch (error) {
        console.error('Error creating join request:', error);
        throw error;
    }
}

export async function getJoinRequestsByServerId(serverId:string):Promise<string[]> {
    try {
        const { rows } = await query(`
            SELECT user_id
            FROM app.server_join_requests
            WHERE server_id = $1
        `, [serverId]);

        return rows.map(row => row.user_id);
    } catch (error) {
        console.error('Error getting join requests:', error);
        throw error;
    }
}

export async function approveJoinRequestById(requestId: string): Promise<{userId: string, serverId: string} | null> {
    try {
        // Begin transaction
        await query('BEGIN');
        
        try {
            // First get the user_id and server_id from the request
            const { rows } = await query(`
                SELECT user_id, server_id
                FROM app.server_join_requests
                WHERE id = $1
            `, [requestId]);
            
            if (rows.length === 0) {
                await query('ROLLBACK');
                return null;
            }
            
            const { user_id: userId, server_id: serverId } = rows[0];
            
            // Add the user to the server members
            await query(`
                INSERT INTO app.server_members (server_id, user_id, role)
                VALUES ($1, $2, 'member')
                ON CONFLICT (server_id, user_id) DO NOTHING
            `, [serverId, userId]);
            
            // Delete the request (or optionally update status to 'approved')
            await query(`
                DELETE FROM app.server_join_requests
                WHERE id = $1
            `, [requestId]);
            
            // Commit transaction
            await query('COMMIT');
            
            return { userId, serverId };
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error approving join request:', error);
        throw error;
    }
}

export async function rejectJoinRequestById(requestId: string): Promise<{userId: string, serverId: string} | null> {
    try {
        // Get the request details first
        const { rows } = await query(`
            SELECT user_id, server_id
            FROM app.server_join_requests
            WHERE id = $1 AND status = 'pending'
        `, [requestId]);
        
        if (rows.length === 0) {
            return null;
        }
        
        const { user_id: userId, server_id: serverId } = rows[0];
        
        // Delete the request
        await query(`
            DELETE FROM app.server_join_requests
            WHERE id = $1
        `, [requestId]);
        
        return { userId, serverId };
    } catch (error) {
        console.error('Error rejecting join request:', error);
        throw error;
    }
}

export async function getJoinRequetsById(userId:string) {
    try{
        const { rows } = await query(`
            SELECT r.id, r.server_id, r.status, r.created_at,
            s.name as server_name, s.icon_url as server_icon_url
            FROM app.server_join_requests r
            JOIN app.servers s ON r.server_id = s.id
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC
          `, [userId]);

        return rows;
    }
    catch(error){
        console.error('Error getting join requests:', error);
        throw error;
    }
}

// All server where user is admin or owner
export async function getServersWhereUserHasElevatedRole(userId:String) {
    try{
        const { rows: serverRows } = await query(`
            SELECT server_id
            FROM app.server_members
            WHERE user_id = $1 AND (role = 'owner' OR role = 'admin')
          `, [userId]);

        return serverRows.map(row => row.server_id);
    }
    catch(error){
        console.error('Error getting servers where user has elevated role:', error);
        throw error;
    }
}

// Get all join requests for the servers where the user is admin/owner
export async function getIncomingJoinRequestsByServerId(serverIds: any []) {
    try{
        const { rows } = await query(`
            SELECT r.id, r.server_id, r.user_id, r.status, r.created_at,
                   s.name as server_name, s.icon_url as server_icon_url,
                   u.username as username, u.avatar_url as user_avatar_url
            FROM app.server_join_requests r
            JOIN app.servers s ON r.server_id = s.id
            JOIN app.users u ON r.user_id = u.id
            WHERE r.server_id = ANY($1) AND r.status = 'pending'
            ORDER BY r.created_at DESC
          `, [serverIds]);

        return rows;
    }
    catch(error){
        console.error('Error getting incoming join requests:', error);
        throw error;
    }

}

export async function getServerAdmins(serverId: string): Promise<string[]> {
    const { rows } = await query(`
        SELECT user_id 
        FROM app.server_members 
        WHERE server_id = $1 AND (role = 'owner' OR role = 'admin')
    `, [serverId]);
    
    return rows.map(row => row.user_id);
}

export async function getUsernameById(userId: string): Promise<string> {
    const { rows } = await query(`
        SELECT username 
        FROM app.users 
        WHERE id = $1
    `, [userId]);
    
    return rows.length > 0 ? rows[0].username : 'Unknown User';
}

export async function getServerBasicDetails(serverId: string) {
    const { rows } = await query(`
        SELECT id, name, icon_url as "iconUrl"
        FROM app.servers
        WHERE id = $1
    `, [serverId]);
    
    return rows.length > 0 ? rows[0] : null;
}

// This will update server name
export async function updateServerNameById(serverId: string, newName: string): Promise<void> {
    try {
        await query(`
            UPDATE app.servers
            SET name = $1
            WHERE id = $2
        `, [newName, serverId]);
    } catch (error) {
        console.error('Error updating server name:', error);
        throw error;
    }
}

// This will update server icon
export async function updateServerIconById(serverId: string, iconUrl: string): Promise<void> {
    try {
        await query(`
            UPDATE app.servers
            SET icon_url = $1
            WHERE id = $2
        `, [iconUrl, serverId]);
    } catch (error) {
        console.error('Error updating server icon:', error);
        throw error;
    }
}