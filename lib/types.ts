export interface SensorReading {
  time: string
  value: number
  average?: number
}

export interface UVReading {
  time: string
  uva: number
  uvb: number
}

export interface VOCReading {
  time: string
  voc: number
  tvoc: number
}

export interface VOCDistribution {
  name: string
  value: number
}

export interface CurrentReadings {
  temperature: number
  humidity: number
  pressure: number
  co2: number
  uva: number
  uvb: number
  voc: number
  tvoc: number
}

export interface HabitabilityFactor {
  name: string
  score: number
}

export interface Prediction {
  time: string
  temperature: number
  humidity: number
  co2: number
}

export interface AIAnalysis {
  summary: string
  keyFindings: string[]
  predictionSummary: string
  predictions: Prediction[]
  recommendations: string[]
}

export interface SensorData {
  temperature: SensorReading[]
  humidity: SensorReading[]
  pressure: SensorReading[]
  co2: SensorReading[]
  uv: UVReading[]
  voc: VOCReading[]
  vocDistribution: VOCDistribution[]
  currentReadings: CurrentReadings
  habitabilityScore: number
  habitabilityFactors: HabitabilityFactor[]
  aiAnalysis: AIAnalysis
}
