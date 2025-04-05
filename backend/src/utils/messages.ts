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

// This function will get all messages for a specific channel
export async function getMessagesForChannelById(channelId: string) {
    // Get messages for the specified channel
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
            m.channel_id = $1
        ORDER BY 
            m.created_at ASC
        `,
        [channelId]
    );

    return messages.rows;
}

// This function will send a message to a specific channel in a server
// Message is an object that contains the message content and other metadata
export async function sendMessageByChannel(userId: string, serverId: string, channelId: string, message: string) {
    // Verify channel belongs to server
    const channelCheck = await query(
        `SELECT id FROM app.channels WHERE id = $1 AND server_id = $2`,
        [channelId, serverId]
    );
    
    if (channelCheck.rows.length === 0) {
        throw new Error("Channel not found in the specified server");
    }
    
    // Insert the message
    const result = await query(
        `
        INSERT INTO app.messages (content, sender_id, channel_id)
        VALUES ($1, $2, $3)
        RETURNING id, created_at
        `,
        [message, userId, channelId]
    );

    return result.rows[0];
}