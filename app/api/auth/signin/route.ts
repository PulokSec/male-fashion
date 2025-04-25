import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { signJwtToken, setAuthCookies, type UserJwtPayload } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find the user
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create user payload for JWT
    const userPayload: UserJwtPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    }

    // Generate JWT token
    const token = await signJwtToken(userPayload)

    // Create response
    const response = NextResponse.json({
      user: userPayload,
      token,
    })

    // Set cookies
    setAuthCookies(response, token)

    return response
  } catch (error) {
    console.error("Error during signin:", error)
    return NextResponse.json({ error: "An error occurred during signin" }, { status: 500 })
  }
}
