import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed service types
const ALLOWED_SERVICES = [
  'massage',
  'gommage',
  'teinture',
  'cire-orientae',
  'soin-du-visage'
];

// Allowed paths
const ALLOWED_PATHS = [
  '/',
  '/info',
  '/services'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/data') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|json|css|js)$/i)
  ) {
    return NextResponse.next();
  }

  // Check if it's an allowed path
  const isAllowedPath = ALLOWED_PATHS.some(path => pathname === path || pathname.startsWith(path));

  if (!isAllowedPath) {
    // Redirect unknown paths to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Validate service routes
  if (pathname.startsWith('/services/')) {
    const serviceType = pathname.split('/services/')[1];
    
    // If there's a service type, validate it
    if (serviceType && !ALLOWED_SERVICES.includes(serviceType)) {
      // Redirect invalid service types to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

