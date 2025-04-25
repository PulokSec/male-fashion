// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export const config = {
  matcher: ["/admin/:path*"],
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  // Paths we don't guard here:
  const isSetupPage = pathname === "/admin/setup"
  const isLoginPage = pathname === "/admin/login"

  // Only run setup/auth logic on /admin/* (excluding setup & login themselves)
  if (pathname.startsWith("/admin") && !isSetupPage && !isLoginPage) {
    // 1. Check if the app needs initial setup
    const setupRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || origin}/api/setup`
    )
    const { needsSetup } = await setupRes.json()
    if (needsSetup) {
      return NextResponse.redirect(new URL("/admin/setup", request.url))
    }

    // 2. If setup is complete, check for an authenticated admin user
    const user = await getCurrentUser(request)
    if (!user?.isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // If we get here, setup is done and user is an admin — let it through
    return NextResponse.next()
  }

  // If we’re exactly on /admin/login, redirect to setup if needed
  if (isLoginPage) {
    const setupRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/setup`
    )
    const { needsSetup } = await setupRes.json()
    if (needsSetup) {
      return NextResponse.redirect(new URL("/admin/setup", request.url))
    }
  }

  // Allow all other requests
  return NextResponse.next()
}
