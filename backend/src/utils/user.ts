// Those are functions related to user
import { query } from '../db/pg';

export async function createUser(username: string, email: string, authTag: string, passwordHash: string): Promise<void> {
    try {
        await query(`
        INSERT INTO app.users(username, email, authTag, password_hash)
        VALUES($1, $2, $3, $4)
        `, [username, email, authTag, passwordHash]);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}