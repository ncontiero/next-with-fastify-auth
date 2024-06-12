import type { CookiesFn } from "cookies-next/lib/types";
import { getCookie } from "cookies-next";
import { env } from "@/env.js";

export interface FetcherOpts extends RequestInit {
  token?: string | null;
  searchParams?: Record<string, string> | URLSearchParams | null;
  throwError?: boolean;
}
export interface FetcherResponse<T> {
  data: T | null;
  ok: boolean;
  errorMsg: string | null;
}

export async function baseFetcher<T = unknown>(
  path: string,
  opts?: FetcherOpts,
): Promise<FetcherResponse<T>> {
  const throwError = opts?.throwError ?? true;
  const url = new URL(`${env.NEXT_PUBLIC_API_URL}${path}`);
  if (opts?.searchParams)
    url.search = new URLSearchParams(opts.searchParams).toString();
  const auth = opts?.token ? { Authorization: `Bearer ${opts.token}` } : null;
  const headers = { ...opts?.headers, ...auth };
  const res = await fetch(url.toString(), { ...opts, headers });
  let data: T | null = null;
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const json = JSON.parse(await res.text());
      msg = json.full_message || msg;
    } catch {}
    if (throwError) throw new Error(msg);
    return { data, ok: false, errorMsg: msg };
  }
  try {
    data = res.status !== 201 ? ((await res.json()) as T) : null;
  } catch (error) {
    if (throwError) throw error;
  }
  return { data, ok: res.ok, errorMsg: null };
}

export async function fetcher<T = unknown>(
  path: string,
  opts?: FetcherOpts,
): Promise<FetcherResponse<T>> {
  let cookieStore: CookiesFn | undefined;

  if (typeof window === "undefined") {
    const { cookies: serverCookies } = await import("next/headers");
    cookieStore = serverCookies;
  }
  const token = getCookie("token", { cookies: cookieStore });

  return baseFetcher<T>(path, { ...opts, token });
}
