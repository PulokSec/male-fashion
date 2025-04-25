import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"

// Secret key for JWT signing and verification
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "7d" // Token expiration time

export type UserJwtPayload = {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

// Generate a JWT token
export async function signJwtToken(payload: UserJwtPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

// Verify a JWT token
export async function verifyJwtToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload as UserJwtPayload
  } catch (error) {
    return null
  }
}

// Set the JWT token in cookies
export function setAuthCookies(response: NextResponse, token: string): NextResponse {
  // Set HTTP-only cookie for security
  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Set a non-HTTP-only cookie to indicate auth state to client
  response.cookies.set({
    name: "auth-state",
    value: "authenticated",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}

// Clear auth cookies
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  response.cookies.set({
    name: "auth-state",
    value: "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}

// Get the current user from the request
export async function getCurrentUser(req: NextRequest): Promise<UserJwtPayload | null> {
  // Try to get token from cookies first
  const token = req.cookies.get("auth-token")?.value

  if (!token) {
    // If no token in cookies, try to get from Authorization header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }
    const headerToken = authHeader.split(" ")[1]
    return await verifyJwtToken(headerToken)
  }

  return await verifyJwtToken(token)
}

// Get the current user from server components
export async function getServerUser(): Promise<UserJwtPayload | null> {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("auth-token")?.value

    if (!token) {
      return null
    }

    return await verifyJwtToken(token)
  } catch (error) {
    console.error("Error getting server user:", error)
    return null
  }
}

// Check if setup is needed (no admin users exist)
export async function checkNeedsSetup(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || ""}/api/setup`)
    if (!response.ok) {
      throw new Error("Failed to check setup status")
    }
    const data = await response.json()
    return data.needsSetup
  } catch (error) {
    console.error("Error checking setup status:", error)
    return false // Default to not needing setup on error
  }
}
