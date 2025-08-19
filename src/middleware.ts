import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token =
      request.cookies.get("ai_toolkit_token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      // Redirect to home page if no token
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const jwtSecret =
        process.env.JWT_SECRET || "fallback-secret-change-in-production";
      const decoded = jwt.verify(token, jwtSecret) as any;

      // Check if user has admin or super admin role
      if (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Add user info to headers for the page to access
      const response = NextResponse.next();
      response.headers.set("x-user-id", decoded.userId);
      response.headers.set("x-user-role", decoded.role);
      response.headers.set("x-user-email", decoded.email);

      return response;
    } catch (error) {
      // Invalid token, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
