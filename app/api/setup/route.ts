import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    // Check if any admin user already exists
    const adminExists = await User.findOne({ isAdmin: true })

    if (adminExists) {
      return NextResponse.json({ error: "Admin account already exists. Please use the login page." }, { status: 400 })
    }

    const data = await req.json()
    const { name, email, password } = data

    // Validate input
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

    // Create admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    })

    return NextResponse.json(
      {
        message: "Admin account created successfully",
        userId: user._id.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating admin account:", error)
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()

    // Check if any admin user exists
    const adminExists = await User.findOne({ isAdmin: true })

    return NextResponse.json({
      needsSetup: !adminExists,
    })
  } catch (error) {
    console.error("Error checking setup status:", error)
    return NextResponse.json({ error: "Failed to check setup status" }, { status: 500 })
  }
}
