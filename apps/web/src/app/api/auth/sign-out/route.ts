import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = "/auth/sign-in";

  cookies().delete("token");

  return NextResponse.redirect(redirectUrl);
}
