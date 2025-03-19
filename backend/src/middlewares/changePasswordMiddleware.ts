import {Request, Response} from "express";
import {decodeJWT} from "@oslojs/jwt";
import {checkPasswordChangeSession} from "../libs/redis";
import {clearPasswordChangeJWT} from "../libs/jwt";

export async function changePasswordProtection(req: Request, res: Response, next: Function): Promise<void> {
    const token = req.cookies['password-change-session'];

    if (!token) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //2. Decode jwt token
    const decoded = decodeJWT(token) as {userId: string, sessionToken:string};

    if (!decoded) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //3. Verify
    const isValid:boolean = await checkPasswordChangeSession(decoded.userId, decoded.sessionToken);

    if (!isValid) {
        clearPasswordChangeJWT(res);
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    req.userId = decoded.userId;

    next();
}