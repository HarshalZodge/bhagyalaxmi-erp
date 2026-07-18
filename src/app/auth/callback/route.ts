import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect address
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Redirect to target destination after successful authentication
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // On error, send user back to the login screen with an error parameter
  return NextResponse.redirect(`${origin}/login-admin?error=auth-callback-failed`);
}
