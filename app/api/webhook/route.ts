import { NextResponse } from "next/server"
import { getSensorData } from "@/lib/data"

// In-memory storage for the latest sensor data
let latestData: any = null

// Initialize with mock data
;(async () => {
  try {
    latestData = await getSensorData()
  } catch (error) {
    console.error("Error initializing data:", error)
  }
})()

// This is a webhook endpoint that will receive data from your Python backend
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data
    const data = await request.json()

    // Make sure latestData is initialized
    if (!latestData) {
      latestData = await getSensorData()
    }

    // Store the latest data
    latestData = {
      ...latestData,
      currentReadings: {
        ...latestData.currentReadings,
        ...data,
      },
      // You could also update historical data here if provided
    }

    console.log("Received sensor data:", data)

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Data received successfully",
      timestamp: new Date().toISOString(),
      dataReceived: data,
    })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ success: false, message: "Failed to process data" }, { status: 400 })
  }
}

// GET endpoint to retrieve the latest data
export async function GET() {
  try {
    // If no data has been received yet, return mock data
    if (!latestData) {
      latestData = await getSensorData()
    }

    return NextResponse.json(latestData)
  } catch (error) {
    console.error("Error retrieving sensor data:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve data" }, { status: 500 })
  }
}
