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
    const signatureKey = textToUint8Array(process.env.JWT_KEY!);

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

    // Convert the JWT_KEY to Uint8Array
    const signatureKey = textToUint8Array(process.env.JWT_KEY!);

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