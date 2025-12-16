import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth');
    const isAuth = authCookie?.value === 'true'; // Simple check

    // Protect /dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!isAuth) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect /login to /dashboard if already logged in
    if (request.nextUrl.pathname === '/login') {
        if (isAuth) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
