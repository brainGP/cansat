// This file simulates AI analysis functions
// In production, replace with actual API calls to your AI backend

// Simulate habitability analysis
export async function analyzeHabitability(): Promise<any> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate random habitability scores
  const overall = Math.floor(40 + Math.random() * 50) // 40-90

  return {
    overall,
    temperature: Math.floor(50 + Math.random() * 40), // 50-90
    humidity: Math.floor(60 + Math.random() * 30), // 60-90
    airQuality: Math.floor(30 + Math.random() * 60), // 30-90
    radiation: Math.floor(20 + Math.random() * 70), // 20-90
  }
}

// Simulate future trend predictions
export async function predictFutureTrends(): Promise<any[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate predictions for various parameters
  const predictions = [
    {
      parameter: "Temperature",
      currentValue: 22 + Math.random() * 5,
      predictedValue: 24 + Math.random() * 5,
      trend: Math.random() > 0.6 ? "increasing" : Math.random() > 0.3 ? "stable" : "decreasing",
      unit: "°C",
    },
    {
      parameter: "Humidity",
      currentValue: 45 + Math.random() * 15,
      predictedValue: 50 + Math.random() * 15,
      trend: Math.random() > 0.5 ? "increasing" : Math.random() > 0.3 ? "stable" : "decreasing",
      unit: "%",
    },
    {
      parameter: "Pressure",
      currentValue: 1010 + Math.random() * 10,
      predictedValue: 1012 + Math.random() * 10,
      trend: Math.random() > 0.7 ? "increasing" : Math.random() > 0.4 ? "stable" : "decreasing",
      unit: "hPa",
    },
    {
      parameter: "CO₂",
      currentValue: 800 + Math.random() * 400,
      predictedValue: 850 + Math.random() * 500,
      trend: Math.random() > 0.6 ? "increasing" : Math.random() > 0.3 ? "stable" : "decreasing",
      unit: "ppm",
    },
    {
      parameter: "UV Index",
      currentValue: 2 + Math.random() * 3,
      predictedValue: 3 + Math.random() * 4,
      trend: Math.random() > 0.5 ? "increasing" : Math.random() > 0.3 ? "stable" : "decreasing",
      unit: "",
    },
  ]

  // Format the values to have at most 1 decimal place
  return predictions.map((p) => ({
    ...p,
    currentValue: Number.parseFloat(p.currentValue.toFixed(1)),
    predictedValue: Number.parseFloat(p.predictedValue.toFixed(1)),
  }))
}
