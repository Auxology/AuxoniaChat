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
