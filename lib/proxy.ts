// lib/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isPrivateRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
};
