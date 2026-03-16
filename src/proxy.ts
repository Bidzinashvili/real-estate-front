import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/sign-in"];
const ADMIN_ONLY_PATHS = ["/agents"];
const AUTH_COOKIE_KEY = "authToken";

type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN" | "AGENT";
};

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

async function fetchAuthUser(token: string, baseUrl: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as AuthUser;
  } catch (error) {
    console.error("[proxy] fetchAuthUser failed", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  const token = cookies.get(AUTH_COOKIE_KEY)?.value;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (isPublicPath(pathname)) {
    if (pathname === "/sign-in" && token && baseUrl) {
      const user = await fetchAuthUser(token, baseUrl);

      if (user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!baseUrl) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const user = await fetchAuthUser(token, baseUrl);

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const isAdminOnlyPath = ADMIN_ONLY_PATHS.some((adminPath) =>
    pathname.startsWith(adminPath),
  );

  if (isAdminOnlyPath && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
