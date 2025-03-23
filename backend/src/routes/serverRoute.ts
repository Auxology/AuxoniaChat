import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { createServer, getServerById, getServerMembers, getUserServers, joinServer, leaveServer, searchServers } from "../controllers/serverController";
import { upload } from "../middlewares/multer";

const serverRoute = Router();

// This will retrive servers
serverRoute.get('/servers/get', isAuthenticated, getUserServers)
// This will create server
serverRoute.post('/servers/create', isAuthenticated, upload.single('server'), createServer) 


// This will serach server
serverRoute.get('/servers/search', isAuthenticated, searchServers);

// This will get server by id
serverRoute.get('/servers/:serverId', isAuthenticated, getServerById)
// This will get server members
serverRoute.get('/servers/:serverId/members', isAuthenticated, getServerMembers);

// This will join server
serverRoute.post('/servers/join', isAuthenticated, joinServer);
// This will leave server
serverRoute.post('/servers/leave', isAuthenticated, leaveServer);


export default serverRoute;