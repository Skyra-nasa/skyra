import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Thermometer, CloudRain, Droplets, Wind, Gauge, Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

function WeatherStatsCards({ statistics }) {
    if (!statistics) return null

    // Helper function to get color based on probability
    const getProbabilityColor = (prob, inverse = false) => {
        if (inverse) {
            // For metrics where lower is better (e.g., rain, discomfort)
            if (prob < 20) return 'text-green-500'
            if (prob < 50) return 'text-yellow-500'
            return 'text-red-500'
        } else {
            // For metrics where higher is better
            if (prob > 80) return 'text-green-500'
            if (prob > 50) return 'text-yellow-500'
            return 'text-red-500'
        }
    }

    const getProgressColor = (prob, inverse = false) => {
        if (inverse) {
            if (prob < 20) return 'bg-green-500'
            if (prob < 50) return 'bg-yellow-500'
            return 'bg-red-500'
        } else {
            if (prob > 80) return 'bg-green-500'
            if (prob > 50) return 'bg-yellow-500'
            return 'bg-red-500'
        }
    }

    const stats = [
        {
            title: 'Temperature',
            icon: Thermometer,
            iconColor: 'text-red-500',
            iconBg: 'bg-red-500/20',
            gradient: 'from-red-500/20 via-orange-500/10 to-red-500/20',
            metrics: [
                {
                    label: 'Average',
                    // value: `${(((statistics.temperature?.avg_celsius) * 1.8) + 32)?.toFixed(1)}°F`,
                    subValue: `${statistics.temperature?.avg_celsius?.toFixed(1)}°C`,
                    icon: Activity,
                    type: 'value'
                },
                {
                    label: 'Temperature Range',
                    value: `${statistics.temperature?.min_celsius?.toFixed(1)}°C - ${statistics.temperature?.max_celsius?.toFixed(1)}°C`,
                    icon: TrendingUp,
                    type: 'range'
                },
                {
                    label: 'Very Hot Days',
                    value: statistics.temperature?.very_hot_prob,
                    displayValue: `${statistics.temperature?.very_hot_prob}%`,
                    warning: statistics.temperature?.very_hot_prob > 0,
                    icon: AlertTriangle,
                    type: 'progress',
                    inverse: true
                },
                {
                    label: 'Very Cold Days',
                    value: statistics.temperature?.very_cold_prob,
                    displayValue: `${statistics.temperature?.very_cold_prob}%`,
                    warning: statistics.temperature?.very_cold_prob > 0,
                    icon: AlertTriangle,
                    type: 'progress',
                    inverse: true
                }
            ]
        },
        {
            title: 'Precipitation',
            icon: CloudRain,
            iconColor: 'text-cyan-500',
            iconBg: 'bg-cyan-500/20',
            gradient: 'from-cyan-500/20 via-blue-500/10 to-cyan-500/20',
            metrics: [
                {
                    label: 'Average Rainfall',
                    value: `${statistics.rain?.avg_mm?.toFixed(2)} mm`,
                    // subValue: `${statistics.rain?.avg_inches?.toFixed(2)} inches`,
                    icon: CloudRain,
                    type: 'value'
                },
                {
                    label: 'Maximum Rainfall',
                    value: `${statistics.rain?.max_mm?.toFixed(2)} mm`,
                    icon: TrendingUp,
                    type: 'value'
                },
                {
                    label: 'Rain Probability',
                    value: statistics.rain?.rainy_day_prob,
                    displayValue: `${statistics.rain?.rainy_day_prob}%`,
                    warning: statistics.rain?.rainy_day_prob > 50,
                    icon: statistics.rain?.rainy_day_prob > 50 ? AlertTriangle : CheckCircle,
                    type: 'progress',
                    inverse: true
                },
                {
                    label: 'Heavy Rain Risk',
                    value: statistics.rain?.heavy_rain_prob,
                    displayValue: `${statistics.rain?.heavy_rain_prob}%`,
                    warning: statistics.rain?.heavy_rain_prob > 0,
                    icon: AlertTriangle,
                    type: 'progress',
                    inverse: true
                }
            ]
        },
        {
            title: 'Humidity',
            icon: Droplets,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-500/20',
            gradient: 'from-blue-500/20 via-cyan-500/10 to-blue-500/20',
            metrics: [
                {
                    label: 'Average Humidity',
                    value: `${statistics.specific_humidity?.avg_g_kg?.toFixed(2)} g/kg`,
                    icon: Droplets,
                    type: 'value'
                },
                {
                    label: 'Humidity Range',
                    value: `${statistics.specific_humidity?.min_g_kg?.toFixed(2)} - ${statistics.specific_humidity?.max_g_kg?.toFixed(2)} g/kg`,
                    icon: TrendingUp,
                    type: 'range'
                },
                {
                    label: 'High Humidity Days',
                    value: statistics.specific_humidity?.high_humidity_prob,
                    displayValue: `${statistics.specific_humidity?.high_humidity_prob}%`,
                    warning: statistics.specific_humidity?.high_humidity_prob > 50,
                    icon: statistics.specific_humidity?.high_humidity_prob > 50 ? AlertTriangle : CheckCircle,
                    type: 'progress',
                    inverse: true
                },
                {
                    label: 'Comfort Status',
                    value: statistics.specific_humidity?.high_humidity_prob < 30 ? 'Comfortable' : 'Humid',
                    icon: statistics.specific_humidity?.high_humidity_prob < 30 ? CheckCircle : AlertTriangle,
                    statusColor: statistics.specific_humidity?.high_humidity_prob < 30 ? 'text-green-500' : 'text-yellow-500',
                    type: 'status'
                }
            ]
        },
        {
            title: 'Wind Speed',
            icon: Wind,
            iconColor: 'text-green-500',
            iconBg: 'bg-green-500/20',
            gradient: 'from-green-500/20 via-emerald-500/10 to-green-500/20',
            metrics: [
                {
                    label: 'Average Wind',
                    value: `${Math.abs(statistics.wind?.avg_mph || 0).toFixed(1)} mph`,
                    icon: Wind,
                    type: 'value'
                },
                {
                    label: 'Maximum Wind',
                    value: `${statistics.wind?.max_mph?.toFixed(1)} mph`,
                    icon: TrendingUp,
                    type: 'value'
                },
                {
                    label: 'Very Windy Days',
                    value: statistics.wind?.very_windy_prob,
                    displayValue: `${statistics.wind?.very_windy_prob}%`,
                    warning: statistics.wind?.very_windy_prob > 50,
                    icon: statistics.wind?.very_windy_prob > 50 ? AlertTriangle : CheckCircle,
                    type: 'progress',
                    inverse: true
                },
                {
                    label: 'Extreme Wind Risk',
                    value: statistics.wind?.extreme_wind_prob,
                    displayValue: `${statistics.wind?.extreme_wind_prob}%`,
                    warning: statistics.wind?.extreme_wind_prob > 0,
                    icon: AlertTriangle,
                    type: 'progress',
                    inverse: true
                }
            ]
        },
        {
            title: 'Atmospheric Pressure',
            icon: Gauge,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-500/20',
            gradient: 'from-purple-500/20 via-violet-500/10 to-purple-500/20',
            metrics: [
                {
                    label: 'Average Pressure',
                    value: `${statistics.pressure?.avg_mb?.toFixed(1)} mb`,
                    icon: Gauge,
                    type: 'value'
                },
                {
                    label: 'Pressure Range',
                    value: `${statistics.pressure?.min_mb?.toFixed(1)} - ${statistics.pressure?.max_mb?.toFixed(1)} mb`,
                    icon: TrendingUp,
                    type: 'range'
                },
                {
                    label: 'Low Pressure Days',
                    value: statistics.pressure?.low_pressure_prob,
                    displayValue: `${statistics.pressure?.low_pressure_prob}%`,
                    warning: statistics.pressure?.low_pressure_prob > 50,
                    icon: statistics.pressure?.low_pressure_prob > 50 ? AlertTriangle : CheckCircle,
                    type: 'progress',
                    inverse: true
                },
                {
                    label: 'Pressure Status',
                    value: statistics.pressure?.avg_mb > 1013 ? 'High Pressure' : 'Low Pressure',
                    icon: statistics.pressure?.avg_mb > 1013 ? TrendingUp : TrendingDown,
                    statusColor: statistics.pressure?.avg_mb > 1013 ? 'text-green-500' : 'text-blue-500',
                    type: 'status'
                }
            ]
        },
        {
            title: 'Overall Comfort',
            icon: Activity,
            iconColor: 'text-orange-500',
            iconBg: 'bg-orange-500/20',
            gradient: 'from-orange-500/20 via-amber-500/10 to-orange-500/20',
            metrics: [
                {
                    label: 'Discomfort Risk',
                    value: statistics.comfort?.very_uncomfortable_prob,
                    displayValue: `${statistics.comfort?.very_uncomfortable_prob}%`,
                    warning: statistics.comfort?.very_uncomfortable_prob > 20,
                    icon: statistics.comfort?.very_uncomfortable_prob > 20 ? AlertTriangle : CheckCircle,
                    type: 'progress',
                    inverse: true
                },
                {
                    label: 'Comfort Status',
                    value: statistics.comfort?.very_uncomfortable_prob < 20 ? 'Comfortable' : 'Uncomfortable',
                    icon: statistics.comfort?.very_uncomfortable_prob < 20 ? CheckCircle : AlertTriangle,
                    statusColor: statistics.comfort?.very_uncomfortable_prob < 20 ? 'text-green-500' : 'text-orange-500',
                    type: 'status'
                },
                {
                    label: 'Data Sample',
                    value: `${statistics.sample_size} years`,
                    icon: Activity,
                    type: 'value'
                },
                {
                    label: 'Data Reliability',
                    value: statistics.sample_size >= 10 ? 'High Confidence' : 'Medium Confidence',
                    icon: statistics.sample_size >= 10 ? CheckCircle : AlertTriangle,
                    statusColor: statistics.sample_size >= 10 ? 'text-green-500' : 'text-yellow-500',
                    type: 'status'
                }
            ]
        }
    ]

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card
                        key={index}
                        className="group relative bg-card/40 backdrop-blur-xl border-2 border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 overflow-hidden"
                    >
                        {/* Animated gradient background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                        <CardHeader className="pb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${stat.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                                    <Icon className={`w-7 h-7 ${stat.iconColor} transition-transform duration-300 group-hover:rotate-12`} />
                                </div>
                                <CardTitle className="text-lg font-bold bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                                    {stat.title}
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 relative z-10">
                            {stat.metrics.map((metric, idx) => {
                                const MetricIcon = metric.icon

                                if (metric.type === 'progress') {
                                    return (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MetricIcon className={`w-4 h-4 ${metric.warning ? 'text-orange-500' : 'text-muted-foreground'}`} />
                                                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                                                </div>
                                                <span className={`text-sm font-bold ${getProbabilityColor(metric.value, metric.inverse)}`}>
                                                    {metric.displayValue}
                                                </span>
                                            </div>
                                            <div className="relative h-2 bg-card/60 rounded-full overflow-hidden backdrop-blur-sm">
                                                <div
                                                    className={`absolute inset-y-0 left-0 ${getProgressColor(metric.value, metric.inverse)} rounded-full transition-all duration-1000 ease-out`}
                                                    style={{
                                                        width: `${metric.value}%`,
                                                        boxShadow: `0 0 10px ${metric.warning ? 'rgba(249, 115, 22, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                }

                                if (metric.type === 'status') {
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-border/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-2">
                                                <MetricIcon className={`w-4 h-4 ${metric.statusColor}`} />
                                                <span className="text-sm text-muted-foreground">{metric.label}</span>
                                            </div>
                                            <span className={`text-sm font-bold ${metric.statusColor}`}>
                                                {metric.value}
                                            </span>
                                        </div>
                                    )
                                }

                                if (metric.type === 'range') {
                                    return (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-xl bg-gradient-to-r from-card/40 to-card/60 backdrop-blur-sm border border-border/30 hover:border-border/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <MetricIcon className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</span>
                                            </div>
                                            <div className="text-base font-bold text-foreground">{metric.value}</div>
                                        </div>
                                    )
                                }

                                // Default: value type
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-border/50 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MetricIcon className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{metric.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-foreground">{metric.value}</div>
                                            {metric.subValue && (
                                                <div className="text-xs text-muted-foreground">{metric.subValue}</div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default WeatherStatsCards
