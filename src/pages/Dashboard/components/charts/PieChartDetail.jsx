import { CloudRain, Sun, Wind, Droplets } from "lucide-react"
import { Pie, PieChart, Cell, Legend } from "recharts"
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

export const description = "Weather conditions distribution"

const chartConfig = {
  probability: {
    label: "Probability",
  },
  rain: {
    label: "Rain Days",
    color: "var(--chart-1)",
  },
  clear: {
    label: "Clear Days",
    color: "var(--chart-2)",
  },
  windy: {
    label: "Windy Days",
    color: "var(--chart-3)",
  },
  humid: {
    label: "Humid Days",
    color: "var(--chart-4)",
  },
}

function PieChartDetail({ weatherData }) {
  // Generate chart data from weather statistics
  const stats = weatherData?.statistics
  const chartData = stats ? [
    { 
      condition: "rain", 
      probability: stats.rain?.rainy_day_prob || 0, 
      fill: "var(--color-rain)",
      label: "Rainy Days"
    },
    { 
      condition: "clear", 
      probability: 100 - (stats.rain?.rainy_day_prob || 0), 
      fill: "var(--color-clear)",
      label: "Clear Days"
    },
    { 
      condition: "windy", 
      probability: stats.wind?.very_windy_prob || 0, 
      fill: "var(--color-windy)",
      label: "Windy Days"
    },
    { 
      condition: "humid", 
      probability: stats.specific_humidity?.high_humidity_prob || 0, 
      fill: "var(--color-humid)",
      label: "Humid Days"
    },
  ].filter(item => item.probability > 0) : []

  const totalRisk = stats ? (
    (stats.rain?.rainy_day_prob || 0) + 
    (stats.wind?.very_windy_prob || 0) + 
    (stats.specific_humidity?.high_humidity_prob || 0)
  ) / 3 : 0

  return (
    <Card className="flex flex-col flex-1 max-lg:flex-auto bg-card/40 backdrop-blur-xl border-2 border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/20">
            <CloudRain className="w-5 h-5 text-cyan-500" />
          </div>
          <CardTitle className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Weather Conditions
          </CardTitle>
        </div>
        <CardDescription>Probability distribution (%)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value, name, item) => [
                  `${value}%`,
                  item.payload.label
                ]}
              />}
            />
            <Pie
              data={chartData}
              dataKey="probability"
              nameKey="condition"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              label={({ probability }) => `${probability}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  {entry.payload.label}
                </span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 leading-none font-medium">
          Average Risk Level: {totalRisk.toFixed(1)}%
        </div>
        <div className="text-muted-foreground leading-none">
          Based on historical probability analysis
        </div>
      </CardFooter>
    </Card>
  )
}
export default PieChartDetail