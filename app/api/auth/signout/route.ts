import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookies } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    clearAuthCookies(response)
    return response
  } catch (error) {
    console.error("Error during signout:", error)
    return NextResponse.json({ error: "An error occurred during signout" }, { status: 500 })
  }
}
