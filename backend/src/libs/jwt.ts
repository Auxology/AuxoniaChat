// This creates token for temporary session during sign up
import { Response } from 'express';
import { encodeJWT, joseAlgorithmHS256 } from '@oslojs/jwt';

// Function to convert string to Uint8Array
const textToUint8Array = (text: string): Uint8Array => {
  return new TextEncoder().encode(text);
}

export const createTemporaryJWT = (email: string, sessionToken: string, res: Response): string => {
    // Define the header with algorithm and convert to string
    const headerStr:string = JSON.stringify({
      alg: joseAlgorithmHS256 
    });
    
    // Define payload with expiration and convert to string
    const payloadStr:string = JSON.stringify({
        email,
        sessionToken,
        exp: Math.floor(Date.now() / 1000) + 600 // 10 minutes from now in seconds
    });

    // Convert the JWT_KEY to Uint8Array
    // Remove non-null assertion
    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) {
        throw new Error('Missing JWT_KEY in environment variables');
    }
    const signatureKey = textToUint8Array(JWT_KEY);

    // Create the token with string parameters
    const token:string = encodeJWT(headerStr, payloadStr, signatureKey);

    res.cookie('temp-session', token, {
        maxAge: 1000 * 60 * 10, // 10 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    return token;
}

// This deletes the token for temporary session
export const clearTemporaryJWT = (res: Response): void => {
    res.clearCookie('temp-session');
}

export const createForgotPasswordJWT = (email: string, sessionToken: string, res: Response): string => {
    // Define the header with algorithm and convert to string
    const headerStr: string = JSON.stringify({
        alg: joseAlgorithmHS256
    });

    // Define payload with expiration and convert to string
    const payloadStr: string = JSON.stringify({
        email,
        sessionToken,
        exp: Math.floor(Date.now() / 1000) + 600 // 10 minutes from now in seconds
    });

    // Remove non-null assertion
    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) {
        throw new Error('Missing JWT_KEY in environment variables');
    }
    const signatureKey = textToUint8Array(JWT_KEY);

    // Create the token with string parameters
    const token: string = encodeJWT(headerStr, payloadStr, signatureKey);

    res.cookie('forgot-password-session', token, {
        maxAge: 1000 * 60 * 10, // 10 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    return token;
}

export const clearForgotPasswordJWT = (res: Response): void => {
    res.clearCookie('forgot-password-session');
}

export const createRecoveryJWT = (userId: string, sessionToken: string, res: Response) => {
    // Define the header with algorithm and convert to string
    const headerStr: string = JSON.stringify({
        alg: joseAlgorithmHS256
    });

    // Define payload with expiration and convert to string
    const payloadStr: string = JSON.stringify({
        userId,
        sessionToken,
        exp: Math.floor(Date.now() / 1000) + 600 // 10 minutes from now in seconds
    });

    // Convert the JWT_KEY to Uint8Array
    // Remove non-null assertion
    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) {
        throw new Error('Missing JWT_KEY in environment variables');
    }
    const signatureKey = textToUint8Array(JWT_KEY);

    // Create the token with string parameters
    const token: string = encodeJWT(headerStr, payloadStr, signatureKey);

    res.cookie('recovery-session', token, {
        maxAge: 1000 * 60 * 10, // 10 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    return token;
}

export const clearRecoveryJWT = (res: Response): void => {
    res.clearCookie('recovery-session');
}

export const createAdvancedRecoveryJWT = (email: string, userId:string,sessionToken: string, res: Response): string => {
    // Define the header with algorithm and convert to string
    const headerStr: string = JSON.stringify({
        alg: joseAlgorithmHS256
    });

    // Define payload with expiration and convert to string
    const payloadStr: string = JSON.stringify({
        email,
        userId,
        sessionToken,
        exp: Math.floor(Date.now() / 1000) + 600 // 10 minutes from now in seconds
    });

    // Convert the JWT_KEY to Uint8Array
    // Remove non-null assertion
    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) {
        throw new Error('Missing JWT_KEY in environment variables');
    }
    const signatureKey = textToUint8Array(JWT_KEY);

    // Create the token with string parameters
    const token: string = encodeJWT(headerStr, payloadStr, signatureKey);

    res.cookie('advanced-recovery-session', token, {
        maxAge: 1000 * 60 * 10, // 10 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    return token;
}

export const clearAdvancedRecoveryJWT = (res: Response): void => {
    res.clearCookie('advanced-recovery-session');
}

export const createPasswordChangeJWT = (userId: string, sessionToken: string, res: Response): string => {
    // Define the header with algorithm and convert to string
    const headerStr: string = JSON.stringify({
        alg: joseAlgorithmHS256
    });

    // Define payload with expiration and convert to string
    const payloadStr: string = JSON.stringify({
        userId,
        sessionToken,
        exp: Math.floor(Date.now() / 1000) + 600 // 10 minutes from now in seconds
    });

    // Convert the JWT_KEY to Uint8Array
    // Remove non-null assertion
    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) {
        throw new Error('Missing JWT_KEY in environment variables');
    }
    const signatureKey = textToUint8Array(JWT_KEY);

    // Create the token with string parameters
    const token: string = encodeJWT(headerStr, payloadStr, signatureKey);

    res.cookie('password-change-session', token, {
        maxAge: 1000 * 60 * 10, // 10 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    return token;
}

export const clearPasswordChangeJWT = (res: Response): void => {
    res.clearCookie('password-change-session');
}

export const createTwoFaJWT = (email: string, sessionToken: string, res: Response): string => {
    // Define the header with algorithm and convert to string
    const headerStr: string = JSON.stringify({
        alg: joseAlgorithmHS256
    });

    // Define payload with expiration and convert to string
    const payloadStr: string = JSON.stringify({
        email,
        sessionToken,
        exp: Math.floor(Date.now() / 1000) + 600 // 10 minutes from now in seconds
    });

    // Convert the JWT_KEY to Uint8Array
    // Remove non-null assertion
    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) {
        throw new Error('Missing JWT_KEY in environment variables');
    }
    const signatureKey = textToUint8Array(JWT_KEY);

    // Create the token with string parameters
    const token: string = encodeJWT(headerStr, payloadStr, signatureKey);

    res.cookie('2fa-session', token, {
        maxAge: 1000 * 60 * 10, // 10 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    return token;
}