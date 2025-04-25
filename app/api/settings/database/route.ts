import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import mongoose from "mongoose"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if connected to database
    const isConnected = mongoose.connection.readyState === 1

    // Get connection info (mask sensitive parts)
    const connectionString = process.env.MONGODB_URI ? maskConnectionString(process.env.MONGODB_URI) : ""

    const databaseName = process.env.MONGODB_DB || ""

    return NextResponse.json({
      connectionString,
      databaseName,
      isConnected,
    })
  } catch (error) {
    console.error("Error fetching database info:", error)
    return NextResponse.json({ error: "Failed to fetch database info" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { connectionString, databaseName } = data

    if (!connectionString) {
      return NextResponse.json({ error: "Connection string is required" }, { status: 400 })
    }

    // In a production environment, you would update environment variables differently
    // For this example, we'll simulate updating the .env file
    // Note: This is not recommended for production use

    // For demonstration purposes only - in production, use a proper env management system
    const envPath = path.join(process.cwd(), ".env.local")
    let envContent = ""

    try {
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8")
      }

      // Update or add MONGODB_URI
      if (envContent.includes("MONGODB_URI=")) {
        envContent = envContent.replace(/MONGODB_URI=.*\n/g, `MONGODB_URI=${connectionString}\n`)
      } else {
        envContent += `\nMONGODBURI=${connectionString}`
      }

      // Update or add MONGODB_DB
      if (databaseName) {
        if (envContent.includes("MONGODB_DB=")) {
          envContent = envContent.replace(/MONGODB_DB=.*\n/g, `MONGODB_DB=${databaseName}\n`)
        } else {
          envContent += `\nMONGODB_DB=${databaseName}`
        }
      } else {
        // Remove MONGODB_DB if it exists and no value is provided
        envContent = envContent.replace(/MONGODB_DB=.*\n/g, "")
      }

      fs.writeFileSync(envPath, envContent)

      // Update process.env for the current session
      process.env.MONGODB_URI = connectionString
      if (databaseName) {
        process.env.MONGODB_DB = databaseName
      } else {
        delete process.env.MONGODB_DB
      }

      // Test the connection
      await connectToDatabase()

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error updating database settings:", error)
      return NextResponse.json(
        {
          error: "Failed to update database settings. Please check your connection string.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error updating database settings:", error)
    return NextResponse.json({ error: "Failed to update database settings" }, { status: 500 })
  }
}

// Helper function to mask sensitive parts of the connection string
function maskConnectionString(connectionString: string): string {
  try {
    // Simple masking for demonstration
    // In a real app, you might want a more sophisticated approach
    if (connectionString.includes("@")) {
      const parts = connectionString.split("@")
      const credentialsPart = parts[0]
      const hostPart = parts[1]

      // Find the position of the last colon before the @ symbol
      const lastColonPos = credentialsPart.lastIndexOf(":")

      if (lastColonPos !== -1) {
        // Mask the password part
        const maskedCredentials = credentialsPart.substring(0, lastColonPos + 1) + "********"

        return `${maskedCredentials}@${hostPart}`
      }
    }

    // If we can't parse it properly, return a generic masked string
    return connectionString.substring(0, 10) + "********"
  } catch (error) {
    return "********"
  }
}
