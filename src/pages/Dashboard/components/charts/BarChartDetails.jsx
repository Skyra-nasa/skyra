import React from "react"
import { TrendingUp, Thermometer } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "var(--chart-1)",
  },
}

function BarChartDetails({ weatherData }) {
  // Generate chart data from weather statistics
  const chartData = weatherData?.statistics ? [
    { 
      metric: "Min", 
      temperature: Number(weatherData.statistics.temperature?.min_fahrenheit?.toFixed(1)) || 0,
      label: "Low"
    },
    { 
      metric: "Avg", 
      temperature: Number(weatherData.statistics.temperature?.avg_fahrenheit?.toFixed(1)) || 0,
      label: "Average"
    },
    { 
      metric: "Max", 
      temperature: Number(weatherData.statistics.temperature?.max_fahrenheit?.toFixed(1)) || 0,
      label: "High"
    },
  ] : [
    { metric: "Min", temperature: 0, label: "Low" },
    { metric: "Avg", temperature: 0, label: "Average" },
    { metric: "Max", temperature: 0, label: "High" },
  ]

  const tempRange = weatherData?.statistics?.temperature 
    ? (weatherData.statistics.temperature.max_fahrenheit - weatherData.statistics.temperature.min_fahrenheit).toFixed(1)
    : 0
  return (
    <Card className="flex-1 max-lg:flex-auto bg-card/40 backdrop-blur-xl border-2 border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/20">
            <Thermometer className="w-5 h-5 text-red-500" />
          </div>
          <CardTitle className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Temperature Analysis
          </CardTitle>
        </div>
        <CardDescription>Historical temperature range (°F)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="metric"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}°F`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                labelFormatter={(value, payload) => {
                  const item = payload?.[0]?.payload
                  return item?.label || value
                }}
                formatter={(value) => [`${value}°F`, "Temperature"]}
              />}
            />
            <Bar 
              dataKey="temperature" 
              fill="var(--color-temperature)" 
              radius={[8, 8, 0, 0]}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => `${value}°F`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
        <div className="flex gap-2 leading-none font-medium items-center">
          <Thermometer className="h-4 w-4 text-red-500" />
          Temperature Range: {tempRange}°F
        </div>
        <div className="text-muted-foreground leading-none">
          Based on {weatherData?.statistics?.sample_size || 10} years of historical data
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarChartDetails
