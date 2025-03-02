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

export async function getUserByEmail(email: string, authTag: string): Promise<any | null> {
    try {
        const { rows } = await query(`
        SELECT id, username, email, authTag
        FROM app.users
        WHERE email = $1 AND authTag = $2
        `, [email, authTag]);

        if (rows && rows.length > 0) {
            return rows[0];
        }

        return null; // No user found with this email and authTag
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
    }
}

// Get password hash from database with email and authTag
export async function getPasswordHash(email: string, authTag: string): Promise<string | null> {
    try {
        const { rows } = await query(`
        SELECT password_hash FROM app.users
        WHERE email = $1 AND authTag = $2
        `, [email, authTag]);

        if (rows && rows.length > 0) {
            return rows[0].password_hash;
        }
        
        return null; // No user found with this email and authTag
    } catch (error) {
        console.error('Error getting password hash:', error);
        throw error;
    }
}