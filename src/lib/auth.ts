import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "backontheblog_auth";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return authCookie?.value === "authenticated";
}

export async function setAuthenticated(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function validatePassword(password: string): boolean {
  return password === process.env.SITE_PASSWORD;
}
