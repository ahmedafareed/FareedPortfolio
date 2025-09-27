import { NextRequest, NextResponse } from 'next/server';

// Extract first subdomain (e.g., travel/commercial) if present
function getSiteKey(host?: string | null): string {
    if (!host) return 'travel'; // default
    const [hostname] = host.split(':');
    const parts = hostname.split('.');
    if (parts.length < 3) return 'travel';
    const sub = parts[0].toLowerCase();
    if (sub === 'travel' || sub === 'commercial') return sub;
    return 'travel';
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const host = req.headers.get('host') || '';
    let siteKey = getSiteKey(host);

    // Path prefix fallback (no subdomain) e.g. /commercial or /travel
    if (siteKey === 'travel') {
        if (pathname.startsWith('/commercial')) siteKey = 'commercial';
        else if (pathname.startsWith('/travel')) siteKey = 'travel';
    }

    // (Temporarily) disable apex redirect to avoid loops in dev / multi-host environments
    // If needed in production, reintroduce with an env flag check.

    const response = NextResponse.next();
    response.headers.set('x-site-key', siteKey);

    // Allow access to login and login API without auth
    if (pathname.startsWith('/login') || pathname.startsWith('/api/admin-login')) return response;

    // Protect admin APIs: require admin session cookie
    if (pathname.startsWith('/api/admin-upload') || pathname.startsWith('/api/admin-hero') || pathname.startsWith('/api/admin-import')) {
        const session = req.cookies.get('admin_session')?.value;
        if (session === 'true') {
            return response;
        }
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (pathname.startsWith('/admin')) {
        // 1) Cookie-based session (works in browsers without Basic Auth support)
        const session = req.cookies.get('admin_session')?.value;
        if (session === 'true') {
            response.headers.set('x-site-key', siteKey);
            return response;
        }

        // 2) Fallback: HTTP Basic Auth (for tools/cURL or supported browsers)
        const basicAuth = req.headers.get('authorization');
        if (basicAuth) {
            const auth = basicAuth.split(' ')[1];
            const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');
            if (user === 'admin' && pwd === process.env.ADMIN_PASSWORD) {
                response.headers.set('x-site-key', siteKey);
                return response;
            }
        }

        // Redirect to login page
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: [
        '/travel',
        '/travel/:path*',
        '/commercial',
        '/commercial/:path*',
        '/admin/:path*',
        '/login',
        '/api/admin-login',
        '/api/admin-upload',
        '/api/admin-hero',
        '/api/admin-import'
    ],
};
