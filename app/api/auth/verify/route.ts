import { NextResponse } from 'next/server';
import { create30DayToken, verify30DayToken, THIRTY_DAYS_SEC } from '@/lib/token';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { password, token } = body;

        // 1. Token Verification request
        if (token && typeof token === 'string') {
            const isValid = verify30DayToken(token);
            if (isValid) {
                return NextResponse.json({
                    success: true,
                    valid: true,
                    message: '30-day auth token is valid',
                });
            }
            return NextResponse.json(
                { success: false, valid: false, message: 'Invalid or expired auth token' },
                { status: 401 }
            );
        }

        // 2. Password Authentication request
        const envPassword =
            process.env.BIRTHDAY_PASSWORD ||
            process.env.NEXT_PUBLIC_BIRTHDAY_PASSWORD ||
            'birthday2026';

        if (password && password.trim() === envPassword.trim()) {
            const { token: newToken, expiresAt } = create30DayToken();

            const response = NextResponse.json({
                success: true,
                message: 'Access granted',
                token: newToken,
                expiresAt,
            });

            // Set 30-day session cookie
            response.cookies.set({
                name: 'singularity_auth_token',
                value: newToken,
                httpOnly: false, // allow client JS access for dynamic state sync
                path: '/',
                maxAge: THIRTY_DAYS_SEC,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Invalid passkey' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Authentication error' },
            { status: 500 }
        );
    }
}
