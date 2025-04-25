"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { SensorData } from "@/lib/types"

// Mongolian translations
const translations = {
  aiAnalysis: "AI Дүн Шинжилгээ",
  habitability: "Амьдрах Боломж",
  predictions: "Урьдчилсан Таамаг",
  lastUpdated: "Сүүлд шинэчлэгдсэн",
  temperature: "Температур",
  humidity: "Чийгшил",
  airQuality: "Агаарын Чанар",
  radiation: "Цацраг",
  aiRecommendation: "AI Зөвлөмж",
  forecastSummary: "Урьдчилсан Таамгийн Хураангуй",
  highlyHabitable: "Амьдрахад Маш Тохиромжтой",
  moderatelyHabitable: "Амьдрахад Дунд Зэрэг Тохиромжтой",
  marginallyHabitable: "Амьдрахад Бага Зэрэг Тохиромжтой",
  notHabitable: "Амьдрахад Тохиромжгүй",
  current: "Одоогийн",
  predicted: "Таамаглал",
  increasing: "Өсөж байна",
  decreasing: "Буурч байна",
  stable: "Тогтвортой",
  overallScore: "Нийт Оноо",
  nextHours: "Дараагийн 24 цаг",
  tomorrow: "Маргааш",
}

type HabitabilityScore = {
  overall: number
  temperature: number
  humidity: number
  airQuality: number
  radiation: number
}

type Prediction = {
  parameter: string
  currentValue: number
  predictedValue: number
  trend: "increasing" | "decreasing" | "stable"
  unit: string
  timeframe: string
}

export default function AIAnalysis({ data }: { data: SensorData }) {
  const [habitabilityScore, setHabitabilityScore] = useState<HabitabilityScore | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Process data and update analysis whenever data changes
  useEffect(() => {
    if (data) {
      analyzeData(data)
    }
  }, [data])

  const analyzeData = (sensorData: SensorData) => {
    // Calculate habitability score based on current readings
    const tempScore = calculateScore(sensorData.currentReadings.temperature, 15, 25, 10, 35)
    const humidityScore = calculateScore(sensorData.currentReadings.humidity, 40, 60, 20, 80)
    const co2Score = calculateScore(sensorData.currentReadings.co2, 400, 1000, 300, 2000, true)
    const radiationScore = 75 // Placeholder, would be calculated from actual radiation data

    const overallScore = Math.round((tempScore + humidityScore + co2Score + radiationScore) / 4)

    setHabitabilityScore({
      overall: overallScore,
      temperature: tempScore,
      humidity: humidityScore,
      airQuality: co2Score,
      radiation: radiationScore,
    })

    // Generate predictions based on trends in data
    const newPredictions: Prediction[] = [
      {
        parameter: translations.temperature,
        currentValue: sensorData.currentReadings.temperature,
        predictedValue: predictValue(sensorData.temperature.map((t) => t.value)),
        trend: determineTrend(sensorData.temperature.map((t) => t.value)),
        unit: "°C",
        timeframe: translations.tomorrow,
      },
      {
        parameter: translations.humidity,
        currentValue: sensorData.currentReadings.humidity,
        predictedValue: predictValue(sensorData.humidity.map((h) => h.value)),
        trend: determineTrend(sensorData.humidity.map((h) => h.value)),
        unit: "%",
        timeframe: translations.tomorrow,
      },
      {
        parameter: "CO₂",
        currentValue: sensorData.currentReadings.co2,
        predictedValue: predictValue(sensorData.co2.map((c) => c.value)),
        trend: determineTrend(sensorData.co2.map((c) => c.value)),
        unit: "ppm",
        timeframe: translations.nextHours,
      },
      {
        parameter: "VOC",
        currentValue: sensorData.currentReadings.voc,
        predictedValue: predictValue(sensorData.voc.map((v) => v.voc)),
        trend: determineTrend(sensorData.voc.map((v) => v.voc)),
        unit: "ppb",
        timeframe: translations.nextHours,
      },
    ]

    setPredictions(newPredictions)
    setLastUpdated(new Date())
  }

  // Helper function to calculate score based on optimal range
  const calculateScore = (
    value: number,
    optimalMin: number,
    optimalMax: number,
    absMin: number,
    absMax: number,
    inverse = false,
  ) => {
    if (value >= optimalMin && value <= optimalMax) {
      return 90 // Optimal range
    }

    if (value < optimalMin) {
      const range = optimalMin - absMin
      const distance = optimalMin - value
      return Math.max(40, 90 - (distance / range) * 50)
    }

    if (value > optimalMax) {
      const range = absMax - optimalMax
      const distance = value - optimalMax
      return Math.max(40, 90 - (distance / range) * 50)
    }

    return inverse ? 100 - value : value
  }

  // Helper function to predict future value based on trend
  const predictValue = (values: number[]): number => {
    if (values.length < 2) return values[0] || 0

    // Simple linear prediction
    const lastValues = values.slice(-5)
    const avgChange =
      lastValues.slice(1).reduce((sum, val, i) => sum + (val - lastValues[i]), 0) / (lastValues.length - 1)

    return Number((lastValues[lastValues.length - 1] + avgChange * 2).toFixed(1))
  }

  // Helper function to determine trend
  const determineTrend = (values: number[]): "increasing" | "decreasing" | "stable" => {
    if (values.length < 2) return "stable"

    const lastValues = values.slice(-5)
    const avgChange =
      lastValues.slice(1).reduce((sum, val, i) => sum + (val - lastValues[i]), 0) / (lastValues.length - 1)

    if (Math.abs(avgChange) < 0.5) return "stable"
    return avgChange > 0 ? "increasing" : "decreasing"
  }

  const getHabitabilityStatus = (score: number) => {
    if (score >= 80) return { label: translations.highlyHabitable, color: "success" }
    if (score >= 60) return { label: translations.moderatelyHabitable, color: "success" }
    if (score >= 40) return { label: translations.marginallyHabitable, color: "warning" }
    return { label: translations.notHabitable, color: "destructive" }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <span className="text-emerald-500">↑</span>
      case "decreasing":
        return <span className="text-amber-500">↓</span>
      default:
        return <span className="text-blue-500">→</span>
    }
  }

  return (
    <Card className="h-full flex flex-col bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>{translations.aiAnalysis}</CardTitle>
          </div>
        </div>
        <CardDescription>
          {lastUpdated ? `${translations.lastUpdated}: ${lastUpdated.toLocaleTimeString()}` : ""}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-auto pb-6">
        <Tabs defaultValue="habitability">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="habitability">{translations.habitability}</TabsTrigger>
            <TabsTrigger value="predictions">{translations.predictions}</TabsTrigger>
          </TabsList>

          <TabsContent value="habitability" className="space-y-4">
            {habitabilityScore ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center p-4 bg-slate-100 rounded-full mb-2">
                    {habitabilityScore.overall >= 60 ? (
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-amber-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{getHabitabilityStatus(habitabilityScore.overall).label}</h3>
                  <p className="text-sm text-slate-500">
                    {translations.overallScore}: {habitabilityScore.overall}/100
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{translations.temperature}</span>
                      <span className="text-sm font-medium">{habitabilityScore.temperature}%</span>
                    </div>
                    <Progress value={habitabilityScore.temperature} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{translations.humidity}</span>
                      <span className="text-sm font-medium">{habitabilityScore.humidity}%</span>
                    </div>
                    <Progress value={habitabilityScore.humidity} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{translations.airQuality}</span>
                      <span className="text-sm font-medium">{habitabilityScore.airQuality}%</span>
                    </div>
                    <Progress value={habitabilityScore.airQuality} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{translations.radiation}</span>
                      <span className="text-sm font-medium">{habitabilityScore.radiation}%</span>
                    </div>
                    <Progress value={habitabilityScore.radiation} className="h-2" />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                  <h4 className="font-medium mb-2">{translations.aiRecommendation}</h4>
                  <p className="text-sm">
                    {habitabilityScore.overall >= 60
                      ? "Энэ орчин хүний амьдрахад тохиромжтой нөхцөлийг харуулж байна. CO₂-ийн түвшин бага зэрэг өндөр байгааг хянаж байгаарай."
                      : "Энэ орчинд хүн амьдрахаас өмнө нэмэлт амьдралын дэмжлэг үзүүлэх систем шаардлагатай. Цацраг болон агаарын чанар нь гол асуудал болж байна."}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400 border-2 border-current border-t-transparent rounded-full" />
                  <p className="text-slate-500">Амьдрах боломжийг шинжилж байна...</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="predictions">
            {predictions.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {predictions.map((prediction, index) => (
                    <Card key={index} className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{prediction.parameter}</h4>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {prediction.timeframe}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-slate-500">
                                {translations.current}: {prediction.currentValue} {prediction.unit}
                              </span>
                              <span className="mx-2 text-slate-400">→</span>
                              <span className="text-sm font-medium">
                                {translations.predicted}: {prediction.predictedValue} {prediction.unit}{" "}
                                {getTrendIcon(prediction.trend)}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              prediction.trend === "stable"
                                ? "outline"
                                : prediction.parameter === translations.temperature && prediction.trend === "increasing"
                                  ? "destructive"
                                  : prediction.parameter === "CO₂" && prediction.trend === "increasing"
                                    ? "destructive"
                                    : "secondary"
                            }
                          >
                            {translations[prediction.trend]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-slate-100 border-none">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{translations.forecastSummary}</h4>
                    <p className="text-sm">
                      {predictions.some(
                        (p) =>
                          p.parameter === translations.temperature && p.trend === "increasing" && p.predictedValue > 30,
                      )
                        ? "Одоогийн чиг хандлагад үндэслэн, температур өсч байгаагаас шалтгаалан орчны нөхцөл муудах төлөвтэй байна."
                        : predictions.some(
                              (p) => p.parameter === "CO₂" && p.trend === "increasing" && p.predictedValue > 1500,
                            )
                          ? "CO₂-ийн түвшин нэмэгдэж байгаагаас шалтгаалан орчны нөхцөл муудах төлөвтэй байна."
                          : "Дараагийн 24 цагийн хугацаанд орчны үзүүлэлтүүд хүлцэх хэмжээнд байх төлөвтэй байна."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400 border-2 border-current border-t-transparent rounded-full" />
                  <p className="text-slate-500">Урьдчилсан таамаг гаргаж байна...</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
