import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/sign-up'];
const AUTH_COOKIE_KEY = 'authToken';

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

export async function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  const token = cookies.get(AUTH_COOKIE_KEY)?.value;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (isPublicPath(pathname)) {
    if (pathname === '/sign-up' && token && baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch {
        // If anything goes wrong, fall through and show sign-up
      }
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  if (!baseUrl) {
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL('/sign-up', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
