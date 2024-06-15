import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const tokenTypes: Record<string, string> = {
  PASSWORD_RECOVER: "/auth/reset-password",
};

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.search = "";
  redirectUrl.pathname = "/";
  const errorParamPrefix = "error_message";

  const tokenType = searchParams.get("token_type");
  const code = searchParams.get("code");
  const json = searchParams.get("json");

  if (!tokenType || !(tokenType in tokenTypes)) {
    const msg = "Invalid token type.";
    redirectUrl.search = `${errorParamPrefix}=${msg}`;
    if (json === "false") return NextResponse.redirect(redirectUrl);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  if (z.string().uuid().safeParse(code).success === false) {
    const msg = "Invalid code.";
    redirectUrl.search = `${errorParamPrefix}=${msg}`;
    if (json === "false") return NextResponse.redirect(redirectUrl);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  redirectUrl.pathname = tokenTypes[tokenType] || "/";
  redirectUrl.search = `code=${code}`;
  return NextResponse.redirect(redirectUrl);
}
