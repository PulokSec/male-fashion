import mongoose from "mongoose"

// Get MongoDB connection string and optional database name from environment variables
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

declare global {
  namespace NodeJS {
    interface Global {
      mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    }
  }
}

interface GlobalWithMongoose extends NodeJS.Global {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

let cached = (global as GlobalWithMongoose).mongoose ?? { conn: null, promise: null }

if (!cached) {
  cached = (global as GlobalWithMongoose).mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    // If a custom database name is provided, use it
    let connectionString = MONGODB_URI!

    // Check if the connection string already includes a database name
    // and if MONGODB_DB is set, replace the database name in the connection string
    if (MONGODB_DB) {
      // Parse the connection string to see if it already has a database
      const urlParts = connectionString.split("/")
      if (urlParts.length > 3) {
        // Replace the database name part
        const dbPart = urlParts[urlParts.length - 1].split("?")
        if (dbPart.length > 1) {
          // Connection string has query parameters
          urlParts[urlParts.length - 1] = MONGODB_DB + "?" + dbPart[1]
        } else {
          // Connection string has no query parameters
          urlParts[urlParts.length - 1] = MONGODB_DB
        }
        connectionString = urlParts.join("/")
      } else {
        // No database in the connection string, append the database name
        connectionString = `${connectionString}/${MONGODB_DB}`
      }
    }

    cached.promise = mongoose.connect(connectionString, opts).then((mongoose) => {
      console.log(`Connected to MongoDB${MONGODB_DB ? ` (Database: ${MONGODB_DB})` : ""}`)
      return mongoose
    })
  }
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  cached.conn = await cached.promise
  return cached.conn
}
