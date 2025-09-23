import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        const basicAuth = req.headers.get('authorization');
        if (basicAuth) {
            const auth = basicAuth.split(' ')[1];
            const [user, pwd] = atob(auth).split(':');

            if (user === 'admin' && pwd === process.env.ADMIN_PASSWORD) {
                return NextResponse.next();
            }
        }
        
        return new Response('Auth required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        });
    }

    return NextResponse.next();
}
