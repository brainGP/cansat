// This file handles API calls to the webhook endpoint

// Function to fetch latest sensor data from webhook
export async function fetchLatestData() {
  try {
    const response = await fetch("/api/webhook", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache: 'no-store' to prevent caching issues
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching sensor data:", error)
    return null
  }
}
