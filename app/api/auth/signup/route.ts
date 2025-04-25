import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { signJwtToken, setAuthCookies, type UserJwtPayload } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if this is the first user (make them admin)
    const isFirstUser = (await User.countDocuments({})) === 0

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: isFirstUser, // First user is admin
    })

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
    console.error("Error during signup:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
