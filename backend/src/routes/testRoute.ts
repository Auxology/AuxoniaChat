// This route is only used for testing purposes. It tests the connection to the Redis server and sends a test email.
import express, {type Router, type Request, type Response } from "express";
import {testRedis} from "../libs/redis.js";
import {emailTest} from "../libs/resend.js";

export const testRoute:Router = express.Router();

testRoute.post("/", (req:Request, res:Response):void => {
  testRedis();
  emailTest().then(r => console.log(r));
  res.send("Hello World");
});