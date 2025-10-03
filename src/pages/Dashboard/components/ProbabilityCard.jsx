import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Snowflake, CloudRain, Wind, AlertTriangle } from 'lucide-react';

const conditionIcons = {
    hot: Thermometer,
    cold: Snowflake,
    wet: CloudRain,
    windy: Wind,
    uncomfortable: AlertTriangle,
};

const conditionColors = {
    hot: 'from-red-500 to-orange-500',
    cold: 'from-blue-500 to-cyan-500',
    wet: 'from-blue-400 to-blue-600',
    windy: 'from-green-400 to-teal-500',
    uncomfortable: 'from-yellow-500 to-orange-500',
};

const ProbabilityCard = ({
    title,
    probability,
    threshold,
    description,
    type,
    trend
}) => {
    const Icon = conditionIcons[type];
    const colorClass = conditionColors[type];

    const riskLevel = probability >= 0.6 ? 'High' : probability >= 0.3 ? 'Medium' : 'Low';
    const riskColor = probability >= 0.6 ? 'destructive' : probability >= 0.3 ? 'secondary' : 'muted';

    return (
        <Card className="relative min-w-sm max-w-lg flex-1 bg-card/40 backdrop-blur-xl border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-105 hover:border-primary/30 hover:-translate-y-1 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 text-weather-${type} transition-transform duration-300 group-hover:scale-110`} />
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    </div>
                    <Badge variant={riskColor} className="text-xs shadow-lg">
                        {riskLevel} Risk
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="relative">
                <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                            {Math.round(probability * 100)}
                        </span>
                        <span className="text-sm text-muted-foreground">%</span>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                            Threshold: <span className="font-medium">{threshold}</span>
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {trend && (
                        <div className="pt-2 border-t">
                            <div className="flex items-center gap-1">
                                <span className={`text-xs ${trend === 'increasing' ? 'text-destructive' :
                                    trend === 'decreasing' ? 'text-green-600' :
                                        'text-muted-foreground'
                                    }`}>
                                    {trend === 'increasing' ? '↗' : trend === 'decreasing' ? '↘' : '→'}
                                </span>
                                <span className="text-xs text-muted-foreground capitalize">
                                    {trend} trend (last 20 years)
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProbabilityCard;