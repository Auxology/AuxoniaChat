import type{ Response } from 'express';

export function createCookieWithEmail (res: Response, email: string):void {
    res.cookie("user_email", email, {
        maxAge: 1000 * 60 * 10, // 10 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
}

export function clearCookieWithEmail (res: Response):void {
    res.clearCookie("user_email");
}