import crypto from 'crypto';

// Server-side encryption key (store securely in env variables)
// Added default values and proper type checking
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || '';

// Validate encryption requirements on startup
if (!ENCRYPTION_KEY || !ENCRYPTION_IV) {
  console.error('ERROR: Missing encryption keys in environment variables');
  console.error('Set EMAIL_ENCRYPTION_KEY and EMAIL_ENCRYPTION_IV in your environment');
  process.exit(1); // Exit if keys are missing - critical security requirement
}


// Encrypt email for database storage
export function encryptEmail(email: string): { encrypted: string, authTag: string }  {
  try {
    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        Buffer.from(ENCRYPTION_IV, 'hex')
    );
    let encrypted = cipher.update(email, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    // Store both encrypted email and auth tag
    return {
      encrypted,
      authTag,
    }
  } 
  catch (err) {
    console.error('Encryption error:', err);
    throw new Error('Failed to encrypt email');
  }
}

// Decrypt email for use in application
export function decryptEmail(encrypted:string, authTag:string): string {
  try {

    if (!encrypted || !authTag) {
      throw new Error('Invalid encrypted value format');
    }

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        Buffer.from(ENCRYPTION_IV, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } 
  catch (err) {
    console.error('Decryption error:', err);
    throw new Error('Failed to decrypt email');
  }
}