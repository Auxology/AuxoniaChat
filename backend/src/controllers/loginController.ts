import { Request, Response } from 'express';
import {decryptEmail, encryptEmail} from "../utils/encrypt";
import {getPasswordHash, getUserByEmail} from "../utils/user";
import { verifyPassword } from '../utils/password';

export const login = async (req: Request, res: Response):Promise<void> => {
    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try{
        //1. Encrypt email to see if it exists
        const { encrypted: encryptedEmail, authTag } = encryptEmail(email);

        //2. Check if email exists
        const user = await getUserByEmail(encryptedEmail, authTag);

        if(!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        //3. Check if password is correct
        // You need to get the password hash from the database
        const hashedPassword = await getPasswordHash(encryptedEmail, authTag);

        // Compare the hashed password with the password provided by the user
        const correctPassword = await verifyPassword(password, hashedPassword!);

        if(!correctPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const decryptedEmail:string = decryptEmail(encryptedEmail, authTag) as string;

        console.log(decryptedEmail);

        //4. Store user info in session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: decryptedEmail,
        }

        req.session.isAuthenticated = true;

        res.status(200).json({ message: 'Logged in successfully' });
    }
    catch(err){
        console.error('Failed to log in', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const logout = async (req: Request, res: Response):Promise<void> => {
    req.session.destroy((err) => {
        if(err) {
            console.error('Failed to log out', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(200).json({ message: 'Logged out successfully' });
    });
}

export const testLogin = async (req: Request, res: Response):Promise<void> => {
    if(req.session.isAuthenticated) {
        res.status(200).json({ message: 'You are logged in' });
    } else {
        res.status(401).json({ error: 'You are not logged in' });
    }
}