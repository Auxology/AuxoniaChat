// Those are functions related to email

import {emailSchema} from "../libs/schemas.js";
import {db} from "../db/index.js";
import {usersTable} from "../db/schema.js";
import {eq} from "drizzle-orm";

// Validate Email
export function validateEmail(email: string):boolean {
    const isValid = emailSchema.safeParse(email);

    return Boolean(isValid.success)
}

// Check if email is already in use
export async function emailInUse(email: string):Promise<boolean> {
    // Email should be encrypted when being passed to this function, there is several ways you can do this
    // Current approach encrypts the email before it send that email to this function

    const [row] = await db.select({id: usersTable.id}).from(usersTable).where(eq(usersTable.email, email)).limit(1);

    return Boolean(row);
}