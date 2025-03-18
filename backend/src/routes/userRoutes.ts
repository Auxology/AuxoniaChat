import { Router } from 'express';
import {isAuthenticated} from "../middlewares/authMiddleware";
import {
    getUserProfile,
    getUserServers,
    createServer,
    getServerById,
    getServerMembers,
    joinServer, changeUserProfilePicture, changeUsername
} from "../controllers/userController";
import { upload } from '../middlewares/multer';


const userRoute:Router = Router();

userRoute.get('/user/profile', isAuthenticated, getUserProfile);
userRoute.get('/user/servers', isAuthenticated, getUserServers)
userRoute.post('/user/servers/create', isAuthenticated, createServer);
userRoute.get('/user/servers/:serverId', isAuthenticated, getServerById);
userRoute.get('/user/servers/:serverId/members', isAuthenticated, getServerMembers);
userRoute.post('/user/servers/join', isAuthenticated, joinServer);
userRoute.post('/user/profile/avatar', isAuthenticated, upload.single('avatar'), changeUserProfilePicture)
userRoute.post('/user/profile/username', isAuthenticated, changeUsername);


export default userRoute;