import { Wind, CloudRain, Gauge } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts"

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

export const description = "Weather metrics trend analysis"

const chartConfig = {
    wind: {
        label: "Wind Speed",
        color: "var(--chart-1)",
    },
    rain: {
        label: "Rain Probability",
        color: "var(--chart-2)",
    },
    pressure: {
        label: "Pressure",
        color: "var(--chart-3)",
    },
}

function LineChartDetails({ weatherData }) {
  // Generate trend data simulating variation around the averages
  const stats = weatherData?.statistics
  const chartData = stats ? [
    { 
      day: "Day 1", 
      wind: Math.max(0, (stats.wind?.avg_mph || 0) - 2),
      rain: Math.max(0, (stats.rain?.rainy_day_prob || 0) - 5),
      pressure: (stats.pressure?.min_mb || 0)
    },
    { 
      day: "Day 2", 
      wind: Math.max(0, (stats.wind?.avg_mph || 0) - 1),
      rain: Math.max(0, (stats.rain?.rainy_day_prob || 0) - 3),
      pressure: (stats.pressure?.avg_mb || 0) - 3
    },
    { 
      day: "Day 3", 
      wind: Math.abs(stats.wind?.avg_mph || 0),
      rain: (stats.rain?.rainy_day_prob || 0),
      pressure: (stats.pressure?.avg_mb || 0)
    },
    { 
      day: "Day 4", 
      wind: Math.max(0, (stats.wind?.avg_mph || 0) + 1),
      rain: Math.min(100, (stats.rain?.rainy_day_prob || 0) + 3),
      pressure: (stats.pressure?.avg_mb || 0) + 2
    },
    { 
      day: "Day 5", 
      wind: (stats.wind?.max_mph || 0),
      rain: Math.min(100, (stats.rain?.rainy_day_prob || 0) + 5),
      pressure: (stats.pressure?.max_mb || 0)
    },
  ] : []
    return (
        <Card className="bg-card/40 backdrop-blur-xl border-2 border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20">
                        <Wind className="w-5 h-5 text-green-500" />
                    </div>
                    <CardTitle className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                        Weather Trends
                    </CardTitle>
                </div>
                <CardDescription>5-day forecast simulation based on historical data</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                            bottom: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            yAxisId="left"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            label={{ value: 'Wind (mph) / Rain (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            label={{ value: 'Pressure (mb)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent 
                                formatter={(value, name) => {
                                    if (name === 'wind') return [`${value.toFixed(1)} mph`, 'Wind Speed']
                                    if (name === 'rain') return [`${value.toFixed(0)}%`, 'Rain Probability']
                                    if (name === 'pressure') return [`${value.toFixed(1)} mb`, 'Pressure']
                                    return [value, name]
                                }}
                            />}
                        />
                        <Legend 
                            verticalAlign="top" 
                            height={36}
                            iconType="line"
                        />
                        <Line
                            yAxisId="left"
                            dataKey="wind"
                            name="Wind Speed"
                            type="monotone"
                            stroke="var(--color-wind)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-wind)",
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                        <Line
                            yAxisId="left"
                            dataKey="rain"
                            name="Rain Probability"
                            type="monotone"
                            stroke="var(--color-rain)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-rain)",
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                        <Line
                            yAxisId="right"
                            dataKey="pressure"
                            name="Pressure"
                            type="monotone"
                            stroke="var(--color-pressure)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{
                                fill: "var(--color-pressure)",
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-3 text-sm pt-4">
                <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-green-500" />
                        <span className="text-muted-foreground">Max Wind: {stats?.wind?.max_mph?.toFixed(1) || 0} mph</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-cyan-500" />
                        <span className="text-muted-foreground">Rain Risk: {stats?.rain?.rainy_day_prob || 0}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-purple-500" />
                        <span className="text-muted-foreground">Avg Pressure: {stats?.pressure?.avg_mb?.toFixed(1) || 0} mb</span>
                    </div>
                </div>
                <div className="text-muted-foreground leading-none">
                    Historical trend projection based on {stats?.sample_size || 10} years of data
                </div>
            </CardFooter>
        </Card>
    )
}
export default LineChartDetails