import { Request, Response } from 'express';
import {getUserByRecoveryCode} from "../utils/user";
import {createRecoverySession} from "../libs/redis";
import {createRecoveryJWT} from "../libs/jwt";
import {emailInUse, validateEmail} from "../utils/email";
import {encryptEmail} from "../utils/encrypt";

export const startRecovery = async (req: Request, res: Response):Promise<void> => {
    try{
        const {recoveryCode} = req.body;

        if(!recoveryCode){
            res.status(400).json({message: 'Recovery code is required'});
            return;
        }

        //1. Search for the user with the recovery code
        const userId:string | null = await getUserByRecoveryCode(recoveryCode);

        if(!userId){
            res.status(404).json({message: 'User not found with this recovery code'});
            return;
        }

        //2. Create a recovery session
        const sessionToken:string | null = await createRecoverySession(userId);

        if(!sessionToken) {
            res.status(500).json({message: 'Internal server error'});
            return;
        }

        //3. Create jwt token
        createRecoveryJWT(userId, sessionToken, res);

        res.status(200).json({ message: 'Account recovery started' });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const recoveryNewEmail = async (req: Request, res: Response):Promise<void> => {
    try{
        const {email} = req.body;

        const isValidEmail:boolean = validateEmail(email);

        if(!isValidEmail){
            res.status(400).json({message: 'Invalid email'});
            return;
        }

        // Encrypt email
        const {encrypted, authTag} = encryptEmail(email);

        // Check if email is in use
        const emailUsed:boolean = await emailInUse(encrypted);

        if(emailUsed){
            res.status(400).json({message: 'Email already in use'});
            return;
        }

    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}