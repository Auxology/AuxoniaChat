import { Request, Response } from 'express';
import {verifyTemporarySession} from "../libs/redis";
import {decodeJWT} from "@oslojs/jwt";
import {clearTemporaryJWT} from "../libs/jwt";
import '../types/types';

export async function signUpProtection(req: Request, res: Response, next: Function): Promise<void> {
    //1. Check if user has jwt token
    const token = req.cookies['temp-session'];

    if (!token) {
        clearTemporaryJWT(res);
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //2. Decode jwt token
    const decoded = decodeJWT(token) as {email: string, sessionToken:string};

    if (!decoded) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //3. Verify temporary session
    const isValid:boolean = await verifyTemporarySession(decoded.email, decoded.sessionToken);

    if (!isValid) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    req.email = decoded.email;
    next();
}