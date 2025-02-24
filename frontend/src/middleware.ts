import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const userId = req.cookies.get('jwt')?.value;

    if (userId) {   
        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    } else if (!userId) {
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/profile') {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
}

export const config = {
    matcher: ['/login', '/signup', '/']
}