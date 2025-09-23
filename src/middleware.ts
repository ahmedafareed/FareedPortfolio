import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow access to login and login API without auth
    if (pathname.startsWith('/login') || pathname.startsWith('/api/admin-login')) {
        return NextResponse.next();
    }

    // Protect admin APIs: require admin session cookie
    if (pathname.startsWith('/api/admin-upload') || pathname.startsWith('/api/admin-hero')) {
        const session = req.cookies.get('admin_session')?.value;
        if (session === 'true') {
            return NextResponse.next();
        }
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (pathname.startsWith('/admin')) {
        // 1) Cookie-based session (works in browsers without Basic Auth support)
        const session = req.cookies.get('admin_session')?.value;
        if (session === 'true') {
            return NextResponse.next();
        }

        // 2) Fallback: HTTP Basic Auth (for tools/cURL or supported browsers)
        const basicAuth = req.headers.get('authorization');
        if (basicAuth) {
            const auth = basicAuth.split(' ')[1];
            const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');
            if (user === 'admin' && pwd === process.env.ADMIN_PASSWORD) {
                return NextResponse.next();
            }
        }

        // Redirect to login page
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/api/admin-login', '/api/admin-upload', '/api/admin-hero'],
};
