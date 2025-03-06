import {query} from "./pg";


/**
 * Initialize database schemas
 */
export async function initializeSchema(): Promise<void> {
  try {
    // Create schemas
    await query(`CREATE SCHEMA IF NOT EXISTS app`);
    
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS app.users (
        id SERIAL PRIMARY KEY UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        authTag VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        recovery_codes VARCHAR(255)[] NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create messages table
    await query(`
      CREATE TABLE IF NOT EXISTS app.messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES app.users(id),
        receiver_id INTEGER REFERENCES app.users(id),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
}