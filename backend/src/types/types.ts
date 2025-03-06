import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
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