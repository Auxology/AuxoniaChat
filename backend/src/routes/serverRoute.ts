import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import {
  createServer,
  deleteServer,
  getServerById,
  getServerMembers,
  getUserServers,
  requestJoinServer,
  approveJoinRequest,
  rejectJoinRequest,
  getServerJoinRequests,
  leaveServer,
  searchServers,
  getSentJoinRequests,
  getIncomingJoinRequests, updateServerName, updateServerIcon
} from "../controllers/serverController";
import { upload } from "../middlewares/multer";

const serverRoute = Router();

// ALL SPECIFIC ROUTES FIRST
// This will retrieve servers
serverRoute.get('/servers/get', isAuthenticated, getUserServers)
// This will create server
serverRoute.post('/servers/create', isAuthenticated, upload.single('server'), createServer) 
// This will search server
serverRoute.get('/servers/search', isAuthenticated, searchServers);
// This will request to join server (replacing direct join)
serverRoute.post('/servers/request-join', isAuthenticated, requestJoinServer);
// This will approve a join request (new route)
serverRoute.post('/servers/approve-join', isAuthenticated, approveJoinRequest);
// This will reject a join request (new route)
serverRoute.post('/servers/reject-join', isAuthenticated, rejectJoinRequest);
// Get all join requests sent by the current user
serverRoute.get('/servers/requests/sent', isAuthenticated, getSentJoinRequests);
// Get all incoming join requests for servers where the user is admin/owner 
serverRoute.get('/servers/requests/incoming', isAuthenticated, getIncomingJoinRequests);
// This will get join requests for a server (new route)
serverRoute.get('/servers/:serverId/join-requests', isAuthenticated, getServerJoinRequests);
// This will leave server
serverRoute.post('/servers/leave', isAuthenticated, leaveServer);
// With this owner will able to delete server
serverRoute.delete('/servers/delete', isAuthenticated, deleteServer)
// With this owner will update(patch) servers name
serverRoute.patch('/servers/name/update', isAuthenticated, updateServerName)
// With this owner will update(patch) servers image
serverRoute.patch('/servers/icon/update', isAuthenticated, upload.single('server'), updateServerIcon)

// DYNAMIC PARAMETER ROUTES LAST
// This will get server by id
serverRoute.get('/servers/:serverId', isAuthenticated, getServerById)
// This will get server members
serverRoute.get('/servers/:serverId/members', isAuthenticated, getServerMembers);

export default serverRoute;