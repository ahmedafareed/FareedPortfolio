import { NextRequest, NextResponse } from 'next/server';
import { isLocale, type Locale } from '@/lib/i18n';

function getLocale(pathname: string): Locale {
    const firstSegment = pathname.split('/')[1];
    return isLocale(firstSegment) ? firstSegment : 'en';
}

function removeLocalePrefix(pathname: string, locale: Locale) {
    if (locale === 'en') return pathname;
    const stripped = pathname.slice(locale.length + 1);
    return stripped ? (stripped.startsWith('/') ? stripped : `/${stripped}`) : '/';
}

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
    const locale = getLocale(pathname);
    const routedPathname = removeLocalePrefix(pathname, locale);
    const host = req.headers.get('host') || '';
    let siteKey = getSiteKey(host);

    // Path prefix fallback (no subdomain) e.g. /commercial or /travel
    if (siteKey === 'travel') {
        if (routedPathname.startsWith('/commercial')) siteKey = 'commercial';
        else if (routedPathname.startsWith('/travel')) siteKey = 'travel';
    }

    // (Temporarily) disable apex redirect to avoid loops in dev / multi-host environments
    // If needed in production, reintroduce with an env flag check.

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-site-key', siteKey);
    requestHeaders.set('x-locale', locale);

    let response: NextResponse;
    if (locale === 'en') {
        response = NextResponse.next({ request: { headers: requestHeaders } });
    } else {
        const rewriteUrl = req.nextUrl.clone();
        rewriteUrl.pathname = routedPathname;
        response = NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
    }
    response.headers.set('x-site-key', siteKey);
    response.headers.set('x-locale', locale);

    // Allow access to login and login API without auth
    if (routedPathname.startsWith('/login') || routedPathname.startsWith('/api/admin-login')) return response;

    // Protect admin APIs: require admin session cookie
    if (routedPathname.startsWith('/api/admin-upload') || routedPathname.startsWith('/api/admin-client-logo') || routedPathname.startsWith('/api/admin-hero') || routedPathname.startsWith('/api/admin-import')) {
        const session = req.cookies.get('admin_session')?.value;
        if (session === 'true') {
            return response;
        }
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (routedPathname.startsWith('/admin')) {
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
        url.pathname = locale === 'en' ? '/login' : `/${locale}/login`;
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
        '/es',
        '/es/:path*',
        '/ca',
        '/ca/:path*',
        '/admin/:path*',
        '/login',
        '/api/admin-login',
        '/api/admin-upload',
        '/api/admin-client-logo',
        '/api/admin-hero',
        '/api/admin-import'
    ],
};
