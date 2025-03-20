import { Router } from 'express';
import {isAuthenticated} from "../middlewares/authMiddleware";
import {
    getUserProfile,
    getUserServers,
    createServer,
    getServerById,
    getServerMembers,
    joinServer,
    changeUserProfilePicture,
    changeUsername,
    requestPasswordChange,
    verifyPasswordChange,
    changePassword,
    requestEmailChange, verifyEmailChange
} from "../controllers/userController";
import { upload } from '../middlewares/multer';
import {changePasswordProtection} from "../middlewares/changePasswordMiddleware";


const userRoute:Router = Router();

userRoute.get('/user/profile', isAuthenticated, getUserProfile);
userRoute.get('/user/servers', isAuthenticated, getUserServers)
userRoute.post('/user/servers/create', isAuthenticated, createServer);
userRoute.get('/user/servers/:serverId', isAuthenticated, getServerById);
userRoute.get('/user/servers/:serverId/members', isAuthenticated, getServerMembers);
userRoute.post('/user/servers/join', isAuthenticated, joinServer);
userRoute.post('/user/profile/avatar', isAuthenticated, upload.single('avatar'), changeUserProfilePicture)
userRoute.post('/user/profile/username', isAuthenticated, changeUsername);

userRoute.post('/user/security/request-password-change', isAuthenticated, requestPasswordChange);
userRoute.post('/user/security/verify-password-change', isAuthenticated, verifyPasswordChange);
userRoute.post('/user/security/complete-password-change', isAuthenticated, changePasswordProtection, changePassword)

userRoute.post('/user/security/request-email-change', isAuthenticated, requestEmailChange)
userRoute.post('/user/security/verify-email-change', isAuthenticated, verifyEmailChange)


export default userRoute;