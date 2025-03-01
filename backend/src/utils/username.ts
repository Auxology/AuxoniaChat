// Those are functions related to username

// Check if username is already in use

import {query} from "../db/pg";
import {usernameSchema} from "../libs/zod";

export async function usernameInUse(username:string):Promise<boolean> {
    const {rows} = await query(
        'SELECT * FROM app.users WHERE username = $1',
        [username]
    )

    return Boolean(rows[0]);
}

export async function validateUsername(username:string):Promise<boolean> {
    return Boolean(usernameSchema.safeParse(username).success);
}