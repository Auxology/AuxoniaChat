// Those are functions related to messages utils
import { query } from '../db/pg';

export async function getMessagesForServerById(serverId: string) {
    // First, get all channel IDs that belong to this server
    const channels = await query(
        `
        SELECT id FROM app.channels 
        WHERE server_id = $1
        `,
        [serverId]
    );
    
    const channelIds = channels.rows.map(channel => channel.id);
    
    if (channelIds.length === 0) {
        return [];
    }
    
    // Then get messages for those channels
    const messages = await query(
        `
        SELECT 
            m.id, 
            m.content AS message, 
            m.created_at,
            m.sender_id,
            u.username,
            u.avatar_url
        FROM 
            app.messages m
        JOIN 
            app.users u ON m.sender_id = u.id
        WHERE 
            m.channel_id = ANY($1)
        ORDER BY 
            m.created_at ASC
        `,
        [channelIds]
    );
    
    return messages.rows;
}