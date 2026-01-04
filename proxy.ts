import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {

  const session = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isPrivateRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }


  if (pathname.startsWith("/api")) {
    const backendUrl = "https://notehub-api.goit.study";
    const targetUrl = request.url.replace(request.nextUrl.origin + "/api", backendUrl);
    
    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*", 
    "/notes/:path*", 
    "/sign-in", 
    "/sign-up", 
    "/api/:path*" 
  ],
};
