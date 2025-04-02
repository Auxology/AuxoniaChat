import { query } from "../db/pg";

// This function creates a new channel in the database
export async function createNewChannel(channelData: {
    id: string,
    serverId: string,
    name: string,
    description?: string
}): Promise<void> {
    try {
        await query(`
            INSERT INTO app.channels (id, server_id, name, description)
            VALUES ($1, $2, $3, $4)
        `, [channelData.id, channelData.serverId, channelData.name, channelData.description || null]);
    } catch (error) {
        console.error('Error creating channel:', error);
        throw error;
    }
}

export async function getServerRole(userId: string, serverId: string): Promise<string | null> {
    try {
        const { rows } = await query(`
            SELECT role
            FROM app.server_members
            WHERE user_id = $1 AND server_id = $2
        `, [userId, serverId]);
        
        return rows.length > 0 ? rows[0].role : null;
    } catch (error) {
        console.error('Error getting server role:', error);
        throw error;
    }
}

// This gets all channels for a server
export async function getServerChannels(serverId: string): Promise<any[]> {
    try {
        const { rows } = await query(`
            SELECT id, name, description
            FROM app.channels
            WHERE server_id = $1
            ORDER BY name
        `, [serverId]);
        
        return rows;
    } catch (error) {
        console.error('Error getting server channels:', error);
        throw error;
    }
}

// This will get specific channel details
export async function getChannelDetailsById(channelId: string): Promise<any> {
    try {
        const { rows } = await query(`
            SELECT id, name, description
            FROM app.channels
            WHERE id = $1
        `, [channelId]);
        
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error getting channel details:', error);
        throw error;
    }
}