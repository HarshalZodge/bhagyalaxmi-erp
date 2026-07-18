import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Update Supabase session cookies and fetch resolved session/role/email
  const { response, role, email } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Retrieve role and auth cookies (used for both Supabase session syncing and local Sandbox fallbacks)
  const authRoleCookie = role || request.cookies.get("bl_auth_role")?.value;
  const userEmailCookie = email || request.cookies.get("bl_auth_email")?.value;

  const isAuth = !!userEmailCookie;
  const isAdmin =
    authRoleCookie &&
    ["Super Admin", "Owner", "Manager", "Accountant", "Staff"].includes(authRoleCookie);
  const isClient = authRoleCookie === "Client";

  // Helper to ensure any redirect response preserves updated session and role cookies
  const withCookies = (redirectRes: NextResponse) => {
    response.cookies.getAll().forEach(cookie => {
      redirectRes.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectRes;
  };

  // Route Guards
  if (path.startsWith("/admin")) {
    if (!isAuth) {
      return withCookies(NextResponse.redirect(new URL("/login-admin", request.url)));
    }
    if (!isAdmin) {
      // Redirect clients away from Admin ERP
      return withCookies(NextResponse.redirect(new URL("/client", request.url)));
    }
  }

  if (path.startsWith("/client")) {
    if (!isAuth) {
      return withCookies(NextResponse.redirect(new URL("/login-client", request.url)));
    }
    if (!isClient) {
      // Redirect admin staff away from Client Portal
      return withCookies(NextResponse.redirect(new URL("/admin", request.url)));
    }
  }

  // Prevent logged-in users from accessing login screens
  if (path === "/login-admin" && isAuth && isAdmin) {
    return withCookies(NextResponse.redirect(new URL("/admin", request.url)));
  }
  if (path === "/login-client" && isAuth && isClient) {
    return withCookies(NextResponse.redirect(new URL("/client", request.url)));
  }

  return response;
}

export const config = {
  // Apply middleware to sensitive admin, client, and authentication paths
  matcher: ["/admin/:path*", "/client/:path*", "/login-admin", "/login-client"],
};
