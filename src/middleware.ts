import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // If user is logged in, prevent access to auth routes (e.g., /sign-in or /sign-up)
    if (token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if(token && url.pathname.startsWith('/verify')){
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // If user is not logged in, restrict access to protected routes (e.g., /dashboard)
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Allow all other requests
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*',
    ],
};
