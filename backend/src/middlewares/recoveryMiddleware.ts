import { Request, Response } from 'express';
import {decodeJWT} from "@oslojs/jwt";
import {clearRecoveryJWT} from "../libs/jwt";
import {checkRecoverySession, verifyAdvancedRecoverySession} from "../libs/redis";

export async function protectRecovery(req: Request, res: Response, next: Function): Promise<void> {
    //1. Check if user has jwt token
    const token = req.cookies['recovery-session'];

    if (!token) {
        clearRecoveryJWT(res);
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //2. Decode jwt token
    const decoded = decodeJWT(token) as {userId: string, sessionToken:string};

    console.log(decoded);

    if (!decoded) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //3. Verify recovery session
    const isValid:boolean = await checkRecoverySession(decoded.userId, decoded.sessionToken);

    if (!isValid) {
        console.log(`${decoded.userId} is invalid`);
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    req.userId = decoded.userId;
    next();
}

export async function advancedRecoveryProtection(req:Request, res:Response, next: Function): Promise<void> {
    //1. Check if user has jwt token
    const token = req.cookies['advanced-recovery-session'];

    if (!token) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //2. Decode jwt token
    const decoded = decodeJWT(token) as {email:string, userId: string, sessionToken:string};

    if (!decoded) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //3. Verify recovery session
    const isValid:boolean = await verifyAdvancedRecoverySession(decoded.email ,decoded.userId, decoded.sessionToken);

    if (!isValid) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    req.email = decoded.email;
    req.userId = decoded.userId;
    next();
}