// Those are functions related to password

// Validate password
import {passwordSchema} from "../libs/zod";
import * as argon2 from "argon2";

export async function validatePassword(password:string):Promise<boolean> {
    return passwordSchema.safeParse(password).success;
}

export async function hashPassword(password:string):Promise<string> {
    return await argon2.hash(password);
}

export async function verifyPassword(password:string, hash:string):Promise<boolean> {
    return await argon2.verify(hash, password);
}