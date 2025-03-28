import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: string;
      username: string;
      email: string;
    };
    isAuthenticated: boolean;
  }
}

declare module 'express' {
  interface Request {
    email?: string;
    userId?: string;
  }
}

export interface UserData {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
    authTag: string;
}

export interface ServerData {
    id: string;
    name: string;
    iconUrl: string | null;
    ownerId: string;
}

export interface UserServers {
    id: string;
    name: string;
    iconUrl: string;
    role: string;
    ownerId: string;
}

// This is very specific to the isMember function in the userController.ts file
export interface ServerDataForUser {
    id: string;
    name: string;
    iconUrl: string | null;
}

export interface ServerMembers {
    id: string;
    username: string;
    avatar_url: string;
    role: string;
}
