// This creates token for temporary session during sign up
import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const createTemporaryJWT = (email:string, sessionToken:string, res:Response):string => {
    const payload ={
        email,
        sessionToken
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!, {
        expiresIn: '10m'// 10 minutes
    });

    res.cookie('temp-session', token, {
        maxAge: 1000 * 60 * 10, // 10 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    return token;
}

// This deletes the token for temporary session
export const clearTemporaryJWT = (res:Response):void => {
    res.clearCookie('temp-session');
}
