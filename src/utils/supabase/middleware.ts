import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 1. If Supabase is not configured, return immediately without network calls
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      response: supabaseResponse,
      role: null,
      email: null,
    };
  }

  // 2. Pre-check cookies: If there are NO Supabase auth cookies, skip remote network call entirely.
  // This avoids hanging and 504 Gateway Timeouts for anonymous visitors or users using local session cookies.
  const allCookies = request.cookies.getAll();
  const hasSbCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && (c.name.includes("auth-token") || c.name.includes("access-token"))
  );

  if (!hasSbCookie) {
    return {
      response: supabaseResponse,
      role: null,
      email: null,
    };
  }

  let role: string | null = null;
  let email: string | null = null;

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // 3. Strict 1500ms timeout guard to prevent Middleware Gateway Timeouts (504) on Vercel
    const authTimeout = new Promise<{ data: { user: null }; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null }, error: new Error("Auth request timeout") }), 1500)
    );

    const authResult = await Promise.race([
      supabase.auth.getUser(),
      authTimeout,
    ]);

    const user = authResult?.data?.user;

    if (user) {
      email = user.email || null;
      const authRoleCookie = request.cookies.get("bl_auth_role")?.value;
      const userEmailCookie = request.cookies.get("bl_auth_email")?.value;

      try {
        const profileTimeout = new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("Profile request timeout") }), 1000)
        );

        const profileResult = await Promise.race([
          supabase.from("profiles").select("role").eq("id", user.id).single(),
          profileTimeout,
        ]);

        const roleStr = profileResult?.data?.role || "Client";
        role = roleStr;

        if (!authRoleCookie || !userEmailCookie || authRoleCookie !== roleStr) {
          supabaseResponse.cookies.set("bl_auth_email", user.email!, { path: "/", maxAge: 86400, sameSite: "lax" });
          supabaseResponse.cookies.set("bl_auth_role", roleStr, { path: "/", maxAge: 86400, sameSite: "lax" });
          request.cookies.set("bl_auth_email", user.email!);
          request.cookies.set("bl_auth_role", roleStr);
        }
      } catch (profileErr) {
        console.warn("Proxy/Middleware: Could not fetch profile role within timeout:", profileErr);
      }
    }
  } catch (err) {
    console.warn("Proxy/Middleware: Supabase session update error or timeout:", err);
  }

  return {
    response: supabaseResponse,
    role,
    email,
  };
}
