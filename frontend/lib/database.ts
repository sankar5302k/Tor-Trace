import { getForensicsCollection } from "./db"
import { mockDatabaseRecords } from "./mock-database"

interface ForensicsRecord {
  _id?: string
  id: string
  target: string
  sender_ip: string
  timestamp: string
  totalLatencyMs: number
  path: Array<{
    node: number
    recvTime: string
    processDelayMs: number
    forwardDelayMs: number
  }>
  fetched: { status: number; contentType: string }
}

export async function getAllRecords(): Promise<ForensicsRecord[]> {
  try {
    const collection = await getForensicsCollection()
    if (!collection) {
      console.log("[v0] MongoDB unavailable, returning mock data")
      return mockDatabaseRecords
    }

    const records = await collection.find({}).toArray()
    console.log("[v0] Retrieved", records.length, "records from MongoDB")
    return records as ForensicsRecord[]
  } catch (error) {
    console.log("[v0] Error fetching from MongoDB, using mock data:", error)
    return mockDatabaseRecords
  }
}

export async function getRecordById(id: string): Promise<ForensicsRecord | null> {
  try {
    const collection = await getForensicsCollection()
    if (!collection) {
      console.log("[v0] MongoDB unavailable, searching mock data")
      return mockDatabaseRecords.find((r) => r.id === id) || null
    }

    const record = await collection.findOne({ id })
    console.log("[v0] Retrieved record", id, "from MongoDB")
    return record as ForensicsRecord | null
  } catch (error) {
    console.log("[v0] Error fetching record from MongoDB, searching mock data:", error)
    return mockDatabaseRecords.find((r) => r.id === id) || null
  }
}

export async function addRecord(record: ForensicsRecord): Promise<ForensicsRecord> {
  try {
    const collection = await getForensicsCollection()
    if (!collection) {
      console.log("[v0] MongoDB unavailable, would save to mock data")
      return record
    }

    const result = await collection.insertOne(record)
    console.log("[v0] Added record to MongoDB:", result.insertedId)
    return { ...record, _id: result.insertedId.toString() }
  } catch (error) {
    console.log("[v0] Error adding record to MongoDB:", error)
    return record
  }
}
