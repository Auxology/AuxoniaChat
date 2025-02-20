import express, {type Router, type Request, type Response } from "express";
import {testRedis} from "../libs/redis.js";

export const testRoute:Router = express.Router();

testRoute.post("/", (req:Request, res:Response) => {
  testRedis();
  res.send("Hello World");
});