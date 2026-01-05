import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

export default async function proxy(request: NextRequest) {
  
  const cookieStore = await cookies();
  const session = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  
  const { pathname } = request.nextUrl;

  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");


  if (!session && refreshToken) {
    try {
      await checkSession();
    } catch (error) {
    
    }
  }

  if (isPrivateRoute && !session && !refreshToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && (session || refreshToken)) {
    return NextResponse.redirect(new URL("/", request.url));
  }


  if (pathname.startsWith("/api")) {
    const backendUrl = "https://notehub-api.goit.study";
    const targetUrl = request.url.replace(request.nextUrl.origin + "/api", backendUrl);
    
    return NextResponse.rewrite(new URL(targetUrl));
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
