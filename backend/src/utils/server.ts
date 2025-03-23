import { query } from '../db/pg';
import { UserServers, ServerData, ServerDataForUser, ServerMembers } from '../types/types';

// All functions related to servers
export async function getServersByUserId(userId: string):Promise<UserServers[]>{
    try {
        const { rows } = await query(`
            SELECT s.id, s.name, s.icon_url as "iconUrl", sm.role
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