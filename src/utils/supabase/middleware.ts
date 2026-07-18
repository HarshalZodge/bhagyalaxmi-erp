import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
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

  // If local sandbox, don't ping Supabase servers to prevent errors
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return supabaseResponse;
  }

  // Refresh auth session
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const authRoleCookie = request.cookies.get("bl_auth_role")?.value;
    const userEmailCookie = request.cookies.get("bl_auth_email")?.value;

    if (!authRoleCookie || !userEmailCookie) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const role = profile?.role || "Client";

        // Set cookies on response so the browser receives them
        supabaseResponse.cookies.set("bl_auth_email", user.email!, { path: "/", maxAge: 86400, sameSite: "lax" });
        supabaseResponse.cookies.set("bl_auth_role", role, { path: "/", maxAge: 86400, sameSite: "lax" });

        // Mutate request cookies so route guards in current middleware run see them
        request.cookies.set("bl_auth_email", user.email!);
        request.cookies.set("bl_auth_role", role);
      } catch (err) {
        console.error("Error fetching user profile in middleware:", err);
      }
    }
  }

  return supabaseResponse;
}
