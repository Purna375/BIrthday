import crypto from 'crypto';

// Secret key for HMAC signature verification
const SECRET_KEY =
    process.env.BIRTHDAY_PASSWORD ||
    process.env.NEXT_PUBLIC_BIRTHDAY_PASSWORD ||
    'singularity_eternal_love_2026_key';

// 30 days in milliseconds (30 days * 24 hrs * 60 mins * 60 secs * 1000 ms)
export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
export const THIRTY_DAYS_SEC = 30 * 24 * 60 * 60;

export interface TokenPayload {
    timestamp: number;
    expiresAt: number;
    nonce: string;
}

/**
 * Creates a cryptographically signed 30-day auth token.
 */
export function create30DayToken(): { token: string; expiresAt: number } {
    const timestamp = Date.now();
    const expiresAt = timestamp + THIRTY_DAYS_MS;
    const nonce = crypto.randomBytes(12).toString('hex');

    const payloadObj: TokenPayload = { timestamp, expiresAt, nonce };
    const payloadStr = JSON.stringify(payloadObj);
    const encodedPayload = Buffer.from(payloadStr, 'utf-8').toString('base64url');

    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(encodedPayload)
        .digest('base64url');

    const token = `${encodedPayload}.${signature}`;
    return { token, expiresAt };
}

/**
 * Verifies a 30-day auth token server-side.
 * Returns true if the token is valid and not expired.
 */
export function verify30DayToken(token: string | null | undefined): boolean {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [encodedPayload, signature] = parts;
    if (!encodedPayload || !signature) return false;

    // Verify signature match
    const expectedSignature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(encodedPayload)
        .digest('base64url');

    if (signature !== expectedSignature) return false;

    try {
        const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
        const payload: TokenPayload = JSON.parse(payloadStr);

        if (!payload.expiresAt || typeof payload.expiresAt !== 'number') {
            return false;
        }

        // Check if token is within the 30-day validity window
        return Date.now() < payload.expiresAt;
    } catch {
        return false;
    }
}
