"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import SensorCharts from "@/components/sensor-charts"
import AIAnalysis from "@/components/ai-analysis"
import { getSensorData } from "@/lib/data"
import { fetchLatestData } from "@/lib/api"

export default function Home() {
  const [sensorData, setSensorData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // First load mock data
        const initialData = await getSensorData()
        setSensorData(initialData)
        setLoading(false)

        // Then try to fetch real data from webhook
        fetchRealTimeData()
      } catch (error) {
        console.error("Error loading initial data:", error)
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Set up real-time data polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealTimeData()
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Function to fetch real-time data from webhook
  const fetchRealTimeData = async () => {
    try {
      const realData = await fetchLatestData()
      if (realData) {
        setSensorData((prevData) => {
          if (!prevData) return realData

          // Create a timestamp for the new data point
          const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

          // Update the data with new readings
          return {
            ...prevData,
            currentReadings: realData.currentReadings || prevData.currentReadings,
            // Add new data point to historical data
            temperature: [
              ...prevData.temperature.slice(1),
              {
                time: timestamp,
                value: realData.currentReadings?.temperature || prevData.currentReadings.temperature,
                average: prevData.temperature[prevData.temperature.length - 1].average,
              },
            ],
            humidity: [
              ...prevData.humidity.slice(1),
              {
                time: timestamp,
                value: realData.currentReadings?.humidity || prevData.currentReadings.humidity,
                average: prevData.humidity[prevData.humidity.length - 1].average,
              },
            ],
            co2: [
              ...prevData.co2.slice(1),
              {
                time: timestamp,
                value: realData.currentReadings?.co2 || prevData.currentReadings.co2,
                average: prevData.co2[prevData.co2.length - 1].average,
              },
            ],
            pressure: [
              ...prevData.pressure.slice(1),
              {
                time: timestamp,
                value: realData.currentReadings?.pressure || prevData.currentReadings.pressure,
                average: prevData.pressure[prevData.pressure.length - 1].average,
              },
            ],
            // Update other sensor data similarly
          }
        })
      } else {
        // If no data returned, use simulated data
        updateWithSimulatedData()
      }
    } catch (error) {
      console.error("Error fetching real-time data:", error)
      // If real data fetch fails, update with simulated data
      updateWithSimulatedData()
    }
  }

  // Function to update with simulated data when real data is unavailable
  const updateWithSimulatedData = () => {
    setSensorData((prevData) => {
      if (!prevData) return prevData

      // Create small random variations for simulation
      const tempVariation = (Math.random() - 0.5) * 0.5
      const humidityVariation = (Math.random() - 0.5) * 1
      const co2Variation = (Math.random() - 0.5) * 20
      const pressureVariation = (Math.random() - 0.5) * 0.5

      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      return {
        ...prevData,
        currentReadings: {
          ...prevData.currentReadings,
          temperature: Number((prevData.currentReadings.temperature + tempVariation).toFixed(1)),
          humidity: Number((prevData.currentReadings.humidity + humidityVariation).toFixed(1)),
          co2: Math.round(prevData.currentReadings.co2 + co2Variation),
          pressure: Number((prevData.currentReadings.pressure + pressureVariation).toFixed(1)),
        },
        // Add new data point to historical data
        temperature: [
          ...prevData.temperature.slice(1),
          {
            time: timestamp,
            value: Number((prevData.currentReadings.temperature + tempVariation).toFixed(1)),
            average: prevData.temperature[prevData.temperature.length - 1].average,
          },
        ],
        humidity: [
          ...prevData.humidity.slice(1),
          {
            time: timestamp,
            value: Number((prevData.currentReadings.humidity + humidityVariation).toFixed(1)),
            average: prevData.humidity[prevData.humidity.length - 1].average,
          },
        ],
        co2: [
          ...prevData.co2.slice(1),
          {
            time: timestamp,
            value: Math.round(prevData.currentReadings.co2 + co2Variation),
            average: prevData.co2[prevData.co2.length - 1].average,
          },
        ],
        pressure: [
          ...prevData.pressure.slice(1),
          {
            time: timestamp,
            value: Number((prevData.currentReadings.pressure + pressureVariation).toFixed(1)),
            average: prevData.pressure[prevData.pressure.length - 1].average,
          },
        ],
      }
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-screen w-full flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin mx-auto mb-4 text-slate-400 border-4 border-current border-t-transparent rounded-full" />
            <p className="text-slate-500">Мэдрэгчийн өгөгдлийг ачаалж байна...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="h-screen w-full flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 py-3 px-4">
          <h1 className="text-xl font-semibold">Мэдрэгчийн Хэмжилтүүд</h1>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 overflow-auto">
            <div className="lg:col-span-2 flex flex-col gap-3">{sensorData && <SensorCharts data={sensorData} />}</div>
            <div className="h-full overflow-auto">{sensorData && <AIAnalysis data={sensorData} />}</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
