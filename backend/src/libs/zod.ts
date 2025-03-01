// This file contains the schema definitions for the application.
import {z, ZodString} from 'zod';

export const emailSchema = z
    .string()
    .email('Please provide a valid email address')
    .min(3, 'Email must be at least 3 characters')
    .max(255, 'Email cannot exceed 255 characters')
    .regex(
        /^[^\s]+@[^\s]+\.[^\s]+$/,
        'Email must not contain whitespace at start or end'
    )
    .transform((email:string):string => email.toLowerCase().trim());

export type EmailSchema = z.infer<typeof emailSchema>;

export const passwordSchema:ZodString = z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(
        /[a-z]/,
        'Password must contain at least one lowercase letter'
    )
    .regex(
        /[A-Z]/,
        'Password must contain at least one uppercase letter'
    )
    .regex(
        /[0-9]/,
        'Password must contain at least one number'
    )
    .regex(
        /[^a-zA-Z0-9\s]/,
        'Password must contain at least one special character'
    )
    .regex(
        /^\S.*\S$|^\S$/, 
        'Password must not contain whitespace at start or end'
    );

export type PasswordSchema = z.infer<typeof passwordSchema>;

export const usernameSchema = z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
        /^[a-zA-Z0-9_\-]+$/,
        'Username can only contain letters, numbers, underscores and hyphens'
    )
    .regex(
        /^[a-zA-Z0-9].*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/,
        'Username must begin and end with a letter or number'
    )
    .transform((username:string):string => username.toLowerCase());

export type UsernameSchema = z.infer<typeof usernameSchema>;