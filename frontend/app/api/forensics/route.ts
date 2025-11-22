import { getAllRecords, addRecord } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const records = await getAllRecords()
    return NextResponse.json(records)
  } catch (error) {
    console.log("[v0] API error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const record = await request.json()
    const savedRecord = await addRecord(record)
    return NextResponse.json(savedRecord, { status: 201 })
  } catch (error) {
    console.log("[v0] API error:", error)
    return NextResponse.json({ error: "Failed to save record" }, { status: 500 })
  }
}
