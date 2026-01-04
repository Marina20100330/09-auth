import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  // Проверяем accessToken (как мы увидели в твоих логах)
  const session = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // ИСПРАВЛЕНО: Добавлены || между условиями
  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // Если пытаемся зайти в приватную зону без токена
  if (isPrivateRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Если мы уже вошли и пытаемся открыть страницу логина
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Проксирование запросов к API
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
