import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "torlab"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  try {
    if (cachedClient && cachedDb) {
      console.log("[v0] Using cached MongoDB connection")
      return { client: cachedClient, db: cachedDb }
    }

    console.log("[v0] Attempting MongoDB connection to:", MONGODB_URI)
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    // Test connection
    await db.admin().ping()
    console.log("[v0] MongoDB connected successfully")

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.log("[v0] MongoDB connection failed:", error instanceof Error ? error.message : String(error))
    throw error
  }
}

export async function getForensicsCollection() {
  try {
    const { db } = await connectToDatabase()
    return db.collection("connections")
  } catch (error) {
    console.log("[v0] Failed to get collection:", error)
    return null
  }
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}
