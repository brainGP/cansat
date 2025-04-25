import type { SensorData } from "./types"

// Generate dummy data for testing
export async function getSensorData(): Promise<SensorData> {
  // Generate time points for the last 24 hours
  const timePoints = Array.from({ length: 24 }, (_, i) => {
    const date = new Date()
    date.setHours(date.getHours() - 24 + i)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  })

  // Generate temperature data with some fluctuation
  const temperature = timePoints.map((time, i) => ({
    time,
    value: Math.round((22 + Math.sin(i / 3) * 5) * 10) / 10,
    average: Math.round((20 + Math.sin(i / 6) * 2) * 10) / 10,
  }))

  // Generate humidity data
  const humidity = timePoints.map((time, i) => ({
    time,
    value: Math.round((60 + Math.cos(i / 4) * 15) * 10) / 10,
    average: Math.round((65 + Math.cos(i / 8) * 5) * 10) / 10,
  }))

  // Generate pressure data
  const pressure = timePoints.map((time, i) => ({
    time,
    value: Math.round((1013 + Math.sin(i / 5) * 10) * 10) / 10,
    average: Math.round((1013 + Math.sin(i / 10) * 5) * 10) / 10,
  }))

  // Generate CO2 data
  const co2 = timePoints.map((time, i) => ({
    time,
    value: Math.round(400 + Math.sin(i / 2) * 100),
    average: Math.round(420 + Math.sin(i / 4) * 50),
  }))

  // Generate UV data
  const uv = timePoints.map((time, i) => ({
    time,
    uva: Math.round((2 + Math.sin(i / 3) * 1.5) * 10) / 10,
    uvb: Math.round((1 + Math.sin(i / 4) * 0.8) * 10) / 10,
  }))

  // Generate VOC data
  const voc = timePoints.map((time, i) => ({
    time,
    voc: Math.round((150 + Math.sin(i / 2) * 50) * 10) / 10,
    tvoc: Math.round((200 + Math.cos(i / 3) * 70) * 10) / 10,
  }))

  // Generate VOC distribution
  const vocDistribution = [
    { name: "Methane", value: 35 },
    { name: "Ethanol", value: 25 },
    { name: "Acetone", value: 20 },
    { name: "Formaldehyde", value: 15 },
    { name: "Other", value: 5 },
  ]

  // Current readings (last values from the arrays)
  const currentReadings = {
    temperature: temperature[temperature.length - 1].value,
    humidity: humidity[humidity.length - 1].value,
    pressure: pressure[pressure.length - 1].value,
    co2: co2[co2.length - 1].value,
    uva: uv[uv.length - 1].uva,
    uvb: uv[uv.length - 1].uvb,
    voc: voc[voc.length - 1].voc,
    tvoc: voc[voc.length - 1].tvoc,
  }

  // Habitability score (0-100)
  const habitabilityScore = 78

  // Habitability factors
  const habitabilityFactors = [
    { name: "Temperature", score: 85 },
    { name: "Humidity", score: 75 },
    { name: "Air Quality", score: 65 },
    { name: "Radiation", score: 90 },
  ]

  // AI Analysis
  const aiAnalysis = {
    summary:
      "Based on the collected sensor data, the environment shows generally favorable conditions for habitability. Temperature and humidity levels are within acceptable ranges, though CO2 levels show some concerning fluctuations that should be monitored.",
    keyFindings: [
      "Temperature remains stable between 17-27°C, ideal for human comfort",
      "Humidity levels are slightly elevated but not concerning",
      "CO2 levels occasionally spike above recommended levels",
      "UV radiation is within safe limits",
      "VOC levels indicate some potential air quality concerns",
    ],
    predictionSummary:
      "Our predictive models suggest stable conditions over the next 24 hours with a slight increase in temperature and CO2 levels. No immediate concerns for habitability are predicted.",
    predictions: timePoints.slice(-8).map((time, i) => ({
      time,
      temperature: Math.round((23 + Math.sin(i / 2) * 3 + i * 0.2) * 10) / 10,
      humidity: Math.round((62 + Math.cos(i / 3) * 5 - i * 0.1) * 10) / 10,
      co2: Math.round(420 + Math.sin(i / 2) * 50 + i * 5),
    })),
    recommendations: [
      "Implement CO2 monitoring alerts for levels exceeding 600ppm",
      "Consider humidity reduction measures if levels exceed 70% for extended periods",
      "Monitor VOC sources and implement filtration if levels continue to rise",
      "Maintain current temperature regulation systems",
      "Schedule regular calibration of UV sensors to ensure accurate readings",
    ],
  }

  return {
    temperature,
    humidity,
    pressure,
    co2,
    uv,
    voc,
    vocDistribution,
    currentReadings,
    habitabilityScore,
    habitabilityFactors,
    aiAnalysis,
  }
}
