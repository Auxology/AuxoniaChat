// Those are functions related to user
import { query } from '../db/pg';



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

export async function getUserByRecoveryCode(recoveryCode:string):Promise<string | null> {
    try{
        const {rows} = await query(`
        SELECT id
        FROM app.users
        WHERE $1 = ANY(recovery_codes)
        `, [recoveryCode]);

        if(rows && rows.length > 0){
            return rows[0];
        }

        return null; // No user found with this recovery code
    }
    catch (error) {
        console.error('Error getting user by recovery code:', error);
        throw error;
    }
}