import { query } from "./pg";

/**
 * Initialize database schemas
 */
export async function initializeSchema(): Promise<void> {
  try {
    // Create schemas
    await query(`CREATE SCHEMA IF NOT EXISTS app`);

    // Enable the UUID extension if not already enabled
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS app.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        authTag VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        recovery_codes VARCHAR(255)[] NOT NULL,
        sess_id VARCHAR(255) [],
        avatar_url VARCHAR(255) DEFAULT 'https://ui-avatars.com/api/?name=John+Doe',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                               )
    `);

    // Create servers table
    await query(`
      CREATE TABLE IF NOT EXISTS app.servers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(50) NOT NULL,
        icon_url VARCHAR(255),
        owner_id UUID REFERENCES app.users(id) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                               )
    `);

    // Create server members table (for user-server relationships)
    await query(`
      CREATE TABLE IF NOT EXISTS app.server_members (
        server_id UUID REFERENCES app.servers(id) NOT NULL,
        user_id UUID REFERENCES app.users(id) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'member',
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(server_id, user_id)
      )
    `);

    // Create channels table
    await query(`
      CREATE TABLE IF NOT EXISTS app.channels (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        server_id UUID REFERENCES app.servers(id) NOT NULL,
        name VARCHAR(50) NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'text',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await query(`
      CREATE TABLE IF NOT EXISTS app.messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        channel_id UUID REFERENCES app.channels(id) NOT NULL,
        sender_id UUID REFERENCES app.users(id) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
}