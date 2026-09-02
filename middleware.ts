import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // 1. Subdomain Hostname Routing
  // Maps creator.arcadehub.in / creator.localhost:3000 -> /creator
  if (hostname.startsWith('creator.')) {
    if (!url.pathname.startsWith('/creator') && !url.pathname.startsWith('/api')) {
      url.pathname = `/creator${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Maps admin.arcadehub.in / admin.localhost:3000 -> /admin
  if (hostname.startsWith('admin.')) {
    if (!url.pathname.startsWith('/admin') && !url.pathname.startsWith('/api')) {
      url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 2. Legacy /developer/* -> /creator/* redirect
  if (url.pathname.startsWith('/developer')) {
    url.pathname = url.pathname.replace('/developer', '/creator');
    return NextResponse.redirect(url, 308);
  }

  // 3. Security Headers
  const res = NextResponse.next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (Service worker)
     * - thumbnails / games (static game assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|thumbnails|games).*)',
  ],
};