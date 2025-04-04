import { z } from 'zod';

// Email validation
export const emailFieldSchema = z.string()
  .email("Invalid email address")
  .min(3, "Email is required")
  .max(255, "Email is too long")
  .regex(/^[^\s]+@[^\s]+\.[^\s]+$/, "Email must not contain whitespace");

export const emailSchema = z.object({
  email: emailFieldSchema
});

export type EmailFormData = z.infer<typeof emailSchema>;

// Password validation - strong requirements (12+ chars)
export const passwordFieldSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9\s]/, 'Password must contain at least one special character')
  .regex(/^\S.*\S$|^\S$/, 'Password must not contain whitespace at start or end');

// Simpler password validation (for login primarily)
export const simplePasswordFieldSchema = z.string()
  .min(8, 'Password must be at least 8 characters');

export const passwordSchema = z.object({
  password: passwordFieldSchema
});

export type PasswordSchema = z.infer<typeof passwordSchema>;

// Username validation
export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9_\-]+$/, 'Username can only contain letters, numbers, underscores and hyphens')
  .regex(/^[a-zA-Z0-9].*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/, 'Username must begin and end with a letter or number')
  .transform((username: string): string => username.toLowerCase());

export type UsernameSchema = z.infer<typeof usernameSchema>;

// Verification code validation (8 chars)
export const codeFieldSchema = z.string()
  .length(8, "Verification code must be 8 characters");

export const verificationCodeSchema = z.object({
  code: codeFieldSchema
});

export type VerificationCodeData = z.infer<typeof verificationCodeSchema>;

// Recovery code validation (20 chars)
export const recoveryCodeFieldSchema = z.string()
  .length(20, "Recovery code must be 20 characters")
  .regex(/^[A-Z0-9]+$/, "Recovery code must only contain uppercase letters and numbers");

export const recoveryCodeSchema = z.object({
  code: recoveryCodeFieldSchema
});

export type RecoveryCodeData = z.infer<typeof recoveryCodeSchema>;

// Password with confirmation
export const passwordWithConfirmSchema = z.object({
  password: passwordFieldSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordWithConfirmData = z.infer<typeof passwordWithConfirmSchema>;

// Login form
export const loginFormSchema = z.object({
  email: emailFieldSchema,
  password: simplePasswordFieldSchema
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Sign-up completion form
export const finishSignUpSchema = z.object({
  username: usernameSchema,
  password: passwordFieldSchema
});

export type FinishSignUpData = z.infer<typeof finishSignUpSchema>;

// Server name validation
export const serverNameSchema = z.string()
  .min(3, { message: "Server name must be at least 3 characters" })
  .max(50, { message: "Server name must be less than 50 characters" });

export const serverDetailsSchema = z.object({
  name: serverNameSchema
});

export type ServerDetailsData = z.infer<typeof serverDetailsSchema>;

// Channel validation
export const channelNameSchema = z.string()
  .min(3, "Channel name must be at least 3 characters")
  .max(50, "Channel name must be less than 50 characters")
  .regex(/^[a-zA-Z0-9-_]+$/, "Channel name can only contain letters, numbers, hyphens, and underscores");

export const channelSchema = z.object({
  name: channelNameSchema,
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

export type ChannelFormData = z.infer<typeof channelSchema>;
