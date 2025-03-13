// Those are functions related to email
import { query } from "../db/pg";
import {emailSchema} from "../libs/zod";


// Validate Email
export function validateEmail(email: string):boolean {
    const isValid = emailSchema.safeParse(email);

    return isValid.success
}

// Check if email is already in use
export async function emailInUse(email: string):Promise<boolean> {
    // Email should be encrypted when being passed to this function, there is several ways you can do this
    // Current approach encrypts the email before it send that email to this function

    const { rows } = await query(
        'SELECT * FROM app.users WHERE email = $1',
        [email]
    )

    return Boolean(rows[0]);
}
