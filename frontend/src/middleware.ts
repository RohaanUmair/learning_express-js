import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (refreshToken) {
        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    } else {
        if (req.nextUrl.pathname === '/') {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/signup', '/']
};
