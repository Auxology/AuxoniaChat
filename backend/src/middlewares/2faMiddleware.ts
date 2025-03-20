import { Request, Response } from 'express';
import {decodeJWT} from "@oslojs/jwt";
import {checkTwoFaSession} from "../libs/redis";

export const protectLogin = async (req: Request, res: Response, next: Function):Promise<void> => {
    const token = req.cookies['2fa-session'];

    if (!token) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //2. Decode jwt token
    const decoded = decodeJWT(token) as {email: string, sessionToken:string};

    if (!decoded) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //3. Verify 2fa session
    const isValidSession:boolean = await checkTwoFaSession(decoded.email, decoded.sessionToken);

    if (!isValidSession) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    req.email = decoded.email;

    next();
}