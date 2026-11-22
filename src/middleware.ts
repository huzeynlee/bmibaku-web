import { NextResponse, type NextRequest } from 'next/server';

/**
 * Locale routing.
 * - Azerbaijani keeps the original URLs (no prefix): /ferdi-bankciliq/ → rendered by /az/ferdi-bankciliq/
 * - English and Persian live under /en/ and /fa/.
 * - /az/... is redirected to the unprefixed canonical URL.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split('/')[1];

  if (first === 'az') {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/az(?=\/|$)/, '') || '/';
    return NextResponse.redirect(url, 308);
  }
  if (first === 'en' || first === 'fa') return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/az${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals and files with an extension.
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};
