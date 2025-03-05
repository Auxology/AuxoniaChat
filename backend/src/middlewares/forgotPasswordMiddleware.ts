import {Request, Response} from "express";
import {clearTemporaryJWT} from "../libs/jwt";
import {decodeJWT} from "@oslojs/jwt";
import {checkForgotPasswordSession} from "../libs/redis";

export async function forgotPasswordProtection(req: Request, res: Response, next: Function): Promise<void> {
    const token = req.cookies['forgot-password-session'];

    if (!token) {
        clearTemporaryJWT(res);
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //2. Decode jwt token
    const decoded = decodeJWT(token) as {email: string, sessionToken:string};

    if (!decoded) {
        clearTemporaryJWT(res);
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    //3. Verify temporary session
    const isValid:boolean = await checkForgotPasswordSession(decoded.email, decoded.sessionToken);

    if (!isValid) {
        clearTemporaryJWT(res);
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    req.email = decoded.email;

    next();
}