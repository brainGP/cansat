"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SensorData } from "@/lib/types"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7", "#ec4899"]

// Mongolian translations
const translations = {
  sensorReadings: "Мэдрэгчийн Хэмжилтүүд",
  temperature: "Температур",
  humidity: "Чийгшил",
  pressure: "Даралт",
  co2: "CO2",
  uv: "Хэт ягаан туяа",
  voc: "Дэгдэмхий Органик Нэгдлүүд",
  keyMetrics: "Үндсэн Үзүүлэлтүүд",
  vocDistribution: "Дэгдэмхий Органик Нэгдлүүдийн Хуваарилалт",
}

export default function SensorCharts({ data }: { data: SensorData }) {
  const [activeTab, setActiveTab] = useState("temperature")

  // Calculate min and max values for each chart to set proper domain
  const getMinMax = (dataArray, key = "value") => {
    if (!dataArray || dataArray.length === 0) return { min: 0, max: 100 }

    const values = dataArray.map((item) => item[key])
    const min = Math.floor(Math.min(...values) * 0.9) // 10% padding below
    const max = Math.ceil(Math.max(...values) * 1.1) // 10% padding above

    return { min, max }
  }

  // Custom pie chart label renderer to prevent text cutoff
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Get domains for charts
  const tempDomain = getMinMax(data?.temperature)
  const humidityDomain = getMinMax(data?.humidity)
  const pressureDomain = getMinMax(data?.pressure)
  const co2Domain = getMinMax(data?.co2)

  return (
    <>
      <Card className="w-full bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>{translations.sensorReadings}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temperature" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="temperature">{translations.temperature}</TabsTrigger>
              <TabsTrigger value="humidity">{translations.humidity}</TabsTrigger>
              <TabsTrigger value="pressure">{translations.pressure}</TabsTrigger>
              <TabsTrigger value="co2">{translations.co2}</TabsTrigger>
              <TabsTrigger value="uv">{translations.uv}</TabsTrigger>
              <TabsTrigger value="voc">{translations.voc}</TabsTrigger>
            </TabsList>
            <TabsContent value="temperature" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.temperature} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis
                    stroke="#888"
                    domain={[tempDomain.min, tempDomain.max]}
                    tickCount={6}
                    tick={{ fontSize: 12 }}
                    label={{ value: "°C", position: "insideLeft", angle: -90, dy: 40, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                    formatter={(value) => [`${value}°C`, translations.temperature]}
                  />
                  <ReferenceLine y={data.currentReadings.temperature} stroke="red" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name={translations.temperature}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name="Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="humidity" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.humidity} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorHumid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis
                    stroke="#888"
                    domain={[humidityDomain.min, humidityDomain.max]}
                    tickCount={6}
                    tick={{ fontSize: 12 }}
                    label={{ value: "%", position: "insideLeft", angle: -90, dy: 40, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                    formatter={(value) => [`${value}%`, translations.humidity]}
                  />
                  <ReferenceLine y={data.currentReadings.humidity} stroke="red" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name={translations.humidity}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name="Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="pressure" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.pressure} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorPress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis
                    stroke="#888"
                    domain={[pressureDomain.min, pressureDomain.max]}
                    tickCount={6}
                    tick={{ fontSize: 12 }}
                    label={{ value: "hPa", position: "insideLeft", angle: -90, dy: 40, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                    formatter={(value) => [`${value} hPa`, translations.pressure]}
                  />
                  <ReferenceLine y={data.currentReadings.pressure} stroke="red" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name={translations.pressure}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name="Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="co2" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.co2} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis
                    stroke="#888"
                    domain={[co2Domain.min, co2Domain.max]}
                    tickCount={6}
                    tick={{ fontSize: 12 }}
                    label={{ value: "ppm", position: "insideLeft", angle: -90, dy: 40, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                    formatter={(value) => [`${value} ppm`, translations.co2]}
                  />
                  <ReferenceLine y={data.currentReadings.co2} stroke="red" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name={translations.co2}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name="Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="uv" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.uv} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorUV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis stroke="#888" tickCount={6} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                  />
                  <ReferenceLine y={data.currentReadings.uva} stroke="red" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="uva"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name="UVA"
                  />
                  <Line
                    type="monotone"
                    dataKey="uvb"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name="UVB"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="voc" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.voc} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorVOC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis
                    stroke="#888"
                    tickCount={6}
                    tick={{ fontSize: 12 }}
                    label={{ value: "ppb", position: "insideLeft", angle: -90, dy: 40, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                    formatter={(value) => [`${value} ppb`, "VOC"]}
                  />
                  <ReferenceLine y={data.currentReadings.voc} stroke="red" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="voc"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name="VOC"
                  />
                  <Line
                    type="monotone"
                    dataKey="tvoc"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    name="TVOC"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>{translations.keyMetrics}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-500">{translations.temperature}</span>
                <span className="text-2xl font-bold">{data.currentReadings.temperature}°C</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-500">{translations.humidity}</span>
                <span className="text-2xl font-bold">{data.currentReadings.humidity}%</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-500">{translations.pressure}</span>
                <span className="text-2xl font-bold">{data.currentReadings.pressure} hPa</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-500">{translations.co2}</span>
                <span className="text-2xl font-bold">{data.currentReadings.co2} ppm</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>{translations.vocDistribution}</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.vocDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {data.vocDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    color: "#333",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
