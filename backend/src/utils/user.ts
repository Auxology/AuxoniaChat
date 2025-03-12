// Those are functions related to user
import {query} from '../db/pg';
import {UserData} from '../types/types';


export async function createUser(username: string, email: string, authTag: string, passwordHash: string, recoveryCodes: string []): Promise<void> {
    try {
        await query(`
        INSERT INTO app.users(username, email, authTag, password_hash, recovery_codes)
        VALUES($1, $2, $3, $4, $5)
        `, [username, email, authTag, passwordHash, recoveryCodes]);
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

// Change password hash in database with email and authTag
export async function resetUserPassword(email: string, authTag: string, newPasswordHash: string): Promise<void> {
    try {
        await query(`
        UPDATE app.users
        SET password_hash = $1
        WHERE email = $2 AND authTag = $3
        `, [newPasswordHash, email, authTag]);
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
}

export async function getUserByRecoveryCode(recoveryCode: string): Promise<string | null> {
    try {
        const { rows } = await query(`
        SELECT id
        FROM app.users
        WHERE $1 = ANY(recovery_codes)
        `, [recoveryCode]);

        if (rows && rows.length > 0) {
            // Return just the ID string, not the entire row object
            return rows[0].id;
        }

        return null; // No user found with this recovery code
    }
    catch (error) {
        console.error('Error getting user by recovery code:', error);
        throw error;
    }
}

// This function changes users account to new email/authTag and password, does so by unique userId
// This also return session ids
export async function recoverAccount(userId: string, email: string, authTag: string, password: string): Promise<string[]> {
    try {
        // First, get the session IDs
        const { rows: sessionRows } = await query(`
        SELECT sess_id 
        FROM app.users
        WHERE id = $1
        `, [userId]);
        
        // Then update the user data
        await query(`
        UPDATE app.users
        SET email = $1, authTag = $2, password_hash = $3
        WHERE id = $4
        `, [email, authTag, password, userId]);
        
        // Return the session IDs array
        return sessionRows[0]?.sess_id || [];

    } catch (error) {
        console.error('Error recovering account:', error);
        throw error;
    }
}

export async function storeSessionId(userId:string, sessionId: any):Promise<void> {
    try {
        await query(`
        UPDATE app.users
        SET sess_id = array_append(sess_id, $1)
        WHERE id = $2
        `, [sessionId, userId]);
    } catch (error) {
        console.error('Error saving session id:', error);
        throw error;
    }
}

// This function remove a session id from the user
export async function removeSessionId(userId: string, sessionIds: string | string[]): Promise<void> {
    try {
        if (Array.isArray(sessionIds)) {
            // If an array is provided, remove each session ID one by one
            for (const sessionId of sessionIds) {
                await query(`
                UPDATE app.users
                SET sess_id = array_remove(sess_id, $1)
                WHERE id = $2
                `, [sessionId, userId]);
            }
        } else {
            // If a single session ID is provided
            await query(`
            UPDATE app.users
            SET sess_id = array_remove(sess_id, $1)
            WHERE id = $2
            `, [sessionIds, userId]);
        }
    } catch (error) {
        console.error('Error removing session id(s):', error);
        throw error;
    }
}

export async function getUserProfileById(userId:string): Promise<UserData | null> {
    try {
        const { rows } = await query(`
        SELECT id, username, email, authtag, avatar_url
        FROM app.users
        WHERE id = $1
        `, [userId]);

        if (rows && rows.length > 0) {
            return {
                id: rows[0].id,
                username: rows[0].username,
                email: rows[0].email,
                authTag: rows[0].authtag,
                avatar_url: rows[0].avatar_url
            };
        }

        return null; // No user found with this ID
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}