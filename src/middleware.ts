import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Update Supabase session cookies
  const response = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Retrieve role and auth cookies (used for both Supabase session syncing and local Sandbox fallbacks)
  const authRoleCookie = request.cookies.get("bl_auth_role")?.value;
  const userEmailCookie = request.cookies.get("bl_auth_email")?.value;

  const isAuth = !!userEmailCookie;
  const isAdmin =
    authRoleCookie &&
    ["Super Admin", "Owner", "Manager", "Accountant", "Staff"].includes(authRoleCookie);
  const isClient = authRoleCookie === "Client";

  // Route Guards
  if (path.startsWith("/admin")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login-admin", request.url));
    }
    if (!isAdmin) {
      // Redirect clients away from Admin ERP
      return NextResponse.redirect(new URL("/client", request.url));
    }
  }

  if (path.startsWith("/client")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login-client", request.url));
    }
    if (!isClient) {
      // Redirect admin staff away from Client Portal
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Prevent logged-in users from accessing login screens
  if (path === "/login-admin" && isAuth && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (path === "/login-client" && isAuth && isClient) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  return response;
}

export const config = {
  // Apply middleware to sensitive admin, client, and authentication paths
  matcher: ["/admin/:path*", "/client/:path*", "/login-admin", "/login-client"],
};
