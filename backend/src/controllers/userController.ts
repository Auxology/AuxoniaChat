import { Request, Response } from 'express';

export const getUserProfile = async (req: Request, res: Response):Promise<void> => {
    try{
        const user = req.session.user?.id;

        console.log(user);

        res.status(200).json({message: 'User profile'});
    }
    catch (error) {
        console.error(`Error in getUserProfile: ${error}`);
        res.status(500).json({message: 'Internal server error'});
    }
}